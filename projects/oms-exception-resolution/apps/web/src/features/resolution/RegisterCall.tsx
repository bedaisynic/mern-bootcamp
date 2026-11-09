import { Alert, Autocomplete, Button, createFilterOptions, TextField } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, PhoneCall } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { intakeOrders } from '@oms/oms-mock-adapters';
import { intakeSchema, type IntakeInput } from '@oms/shared-schemas';
import type { Actor } from '@oms/shared-types';
import { errorMessage, loadQueue, registerCall } from './api';
import { casePath, queuePath } from './navigation';
import { Card, Tag } from './panels';
import s from './workspace.module.css';

const filterOrders = createFilterOptions<typeof intakeOrders[number]>({
  stringify: option => option.orderId + ' ' + option.customer,
});

export function RegisterCall({actor, token}: {actor: Actor; token: string}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const queue = useQuery({queryKey: ['queue', actor.role], queryFn: () => loadQueue(token), enabled: actor.role === 'agent'});
  const ordersWithCases = new Set(queue.data?.map(record => record.orderId));
  const options = queue.data
    ? [...intakeOrders].sort((a, b) => Number(ordersWithCases.has(a.orderId)) - Number(ordersWithCases.has(b.orderId)))
    : [];
  const form = useForm<IntakeInput>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {orderId: '', customerName: '', email: '', notes: ''},
  });
  const mutation = useMutation({
    mutationFn: (input: IntakeInput) => registerCall(token, input),
    onSuccess: result => {
      void queryClient.invalidateQueries({queryKey: ['queue']});
      navigate(casePath(result.id), {state: {registration: result.created ? 'Call registered. You are handling this case.' : 'This order already has a case. Opened the existing case.'}});
    },
  });

  return <div className={s.intakePage}>
    <header className={s.pageHeading}>
      <span className={s.eyebrow}>CUSTOMER SUPPORT INTAKE</span>
      <h1>Register a customer call</h1>
      <p>Link the missed-delivery call to an order. The agent taking the call handles the case.</p>
    </header>
    {actor.role !== 'agent' ? <Alert severity="info">Switch to the Agent role to register a call.</Alert> :
      <Card title="Delivery exception" subtitle="Choose from the demo orders and record what the customer reported." icon={<PhoneCall size={19} />}>
        <div className={s.heroTags}><Tag tone="blue">Handled by {actor.name}</Tag><Tag>Support phone call</Tag></div>
        {queue.isError && <Alert severity="error" sx={{mt: 2}}
          action={<Button onClick={() => void queue.refetch()}>Retry</Button>}>{errorMessage(queue.error)}</Alert>}
        {mutation.isError && <Alert severity="error" sx={{mt: 2}}>{errorMessage(mutation.error)}</Alert>}
        <form className={s.form} onSubmit={form.handleSubmit(input => mutation.mutate(input))} noValidate>
          <Controller name="orderId" control={form.control} render={({field, fieldState}) =>
            <Autocomplete
              options={options}
              value={intakeOrders.find(option => option.orderId === field.value) ?? null}
              getOptionLabel={option => option.orderId}
              filterOptions={filterOrders}
              groupBy={option => ordersWithCases.has(option.orderId) ? 'Orders with existing cases' : 'Orders without cases'}
              loading={queue.isPending}
              noOptionsText="No matching orders"
              renderOption={({key, ...props}, option) => <li key={key} {...props}>{option.orderId} · {option.customer}</li>}
              autoHighlight
              disabled={mutation.isPending}
              onBlur={field.onBlur}
              onChange={(_event, option) => {
                field.onChange(option?.orderId ?? '');
                const update = {shouldValidate: form.formState.isSubmitted};
                form.setValue('customerName', option?.customer ?? '', update);
                form.setValue('email', option?.email ?? '', update);
              }}
              renderInput={params => <TextField {...params} inputRef={field.ref} label="Customer order" required
                placeholder="Search by order number or customer name" error={!!fieldState.error}
                helperText={fieldState.error?.message} />}
            />
          } />
          <Controller name="customerName" control={form.control} render={({field, fieldState}) =>
            <TextField {...field} label="Customer name" required fullWidth autoComplete="off" disabled={mutation.isPending}
              error={!!fieldState.error} helperText={fieldState.error?.message} slotProps={{htmlInput: {maxLength: 100}}} />
          } />
          <Controller name="email" control={form.control} render={({field, fieldState}) =>
            <TextField {...field} label="Email" type="email" required fullWidth autoComplete="off" disabled={mutation.isPending}
              error={!!fieldState.error} helperText={fieldState.error?.message} slotProps={{htmlInput: {maxLength: 254}}} />
          } />
          <Controller name="notes" control={form.control} render={({field, fieldState}) =>
            <TextField {...field} label="Call notes" required multiline minRows={3} disabled={mutation.isPending}
              placeholder="What did the customer report?" error={!!fieldState.error} helperText={fieldState.error?.message ?? 'Use fictional details only.'}
              slotProps={{htmlInput: {maxLength: 500}}} />
          } />
          <div className={s.buttonRow}>
            <Button type="submit" variant="contained" disabled={mutation.isPending || !queue.data} endIcon={<ArrowRight size={16} />}>Register and open case</Button>
            <Button component={Link} to={queuePath} disabled={mutation.isPending}>Cancel</Button>
          </div>
        </form>
      </Card>}
  </div>;
}
