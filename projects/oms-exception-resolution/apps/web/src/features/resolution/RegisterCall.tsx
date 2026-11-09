import { useState } from 'react';
import { Alert, Button, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, ClipboardList, Search, ShieldCheck } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { addressVerificationSchema, intakeSchema, orderLookupSchema, type AddressVerification, type IntakeInput } from '@oms/shared-schemas';
import type { Actor, IntakeOrderMatch, VerifiedIntakeOrder } from '@oms/shared-types';
import { errorMessage, registerCall, searchOrders, verifyAddress } from './api';
import { casePath, queuePath } from './navigation';
import { Card, Tag } from './panels';
import s from './workspace.module.css';

type Confirmation = {order: VerifiedIntakeOrder; verification: AddressVerification};
const steps = ['Find order', 'Verify address', 'Create case'];

function OrderSummary({order}: {order: IntakeOrderMatch}) {
  return <div className={s.intakeSummary}>
    <div><strong>{order.orderId} · {order.customer}</strong><span>{order.item} · Ordered {order.placed}</span></div>
    <Tag tone="amber">{order.deliveryStatus}</Tag>
  </div>;
}

function VerifyAddressStep({order, token, back, confirm}: {
  order: IntakeOrderMatch; token: string; back: () => void; confirm: (result: Confirmation) => void;
}) {
  const form = useForm<AddressVerification>({
    resolver: zodResolver(addressVerificationSchema),
    defaultValues: {streetNumber: '', postalCode: ''},
  });
  const mutation = useMutation({
    mutationFn: (input: AddressVerification) => verifyAddress(token, order.orderId, input),
    onSuccess: (result, verification) => confirm({order: result, verification}),
  });

  return <Card title="Verify delivery address" subtitle="Ask the caller for the street number and ZIP code on this order." icon={<ShieldCheck size={19} />}>
    <OrderSummary order={order} />
    {mutation.isError && <Alert severity="error" sx={{mt: 2}}>{errorMessage(mutation.error)}</Alert>}
    <form className={s.form} onSubmit={form.handleSubmit(input => mutation.mutate(input))} noValidate>
      <div className={s.addressFields}>
        <Controller name="streetNumber" control={form.control} render={({field, fieldState}) =>
          <TextField {...field} label="Street number" required autoComplete="off" error={!!fieldState.error}
            helperText={fieldState.error?.message ?? 'Just the number at the start of the street address'} disabled={mutation.isPending} />
        } />
        <Controller name="postalCode" control={form.control} render={({field, fieldState}) =>
          <TextField {...field} label="ZIP code" required autoComplete="off" error={!!fieldState.error}
            helperText={fieldState.error?.message} disabled={mutation.isPending} />
        } />
      </div>
      <div className={s.buttonRow}>
        <Button type="submit" variant="contained" disabled={mutation.isPending} endIcon={<ArrowRight size={16} />}>Verify address</Button>
        <Button onClick={back} disabled={mutation.isPending} startIcon={<ArrowLeft size={16} />}>Back to results</Button>
      </div>
    </form>
  </Card>;
}

function CreateCaseStep({confirmation, actor, token, back}: {
  confirmation: Confirmation; actor: Actor; token: string; back: () => void;
}) {
  const {order, verification} = confirmation;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useForm<IntakeInput>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {orderId: order.orderId, addressVerification: verification, customerName: order.customer, email: order.email, notes: ''},
  });
  const mutation = useMutation({
    mutationFn: (input: IntakeInput) => registerCall(token, input),
    onSuccess: result => {
      void queryClient.invalidateQueries({queryKey: ['queue']});
      navigate(casePath(result.id), {state: {registration: result.created ? 'Call registered. You are handling this case.' : 'This order already has a case. Opened the existing case.'}});
    },
  });

  return <Card title={order.caseId ? 'Existing exception case' : 'Create exception case'} icon={<ClipboardList size={19} />}>
    <OrderSummary order={order} />
    <div className={s.verifiedAddress}>
      <Tag tone="green"><ShieldCheck size={14} /> Address verified</Tag>
      <span>{order.address}</span>
    </div>
    {order.caseId ? <div className={s.buttonRow}>
      <Button component={Link} to={casePath(order.caseId)} variant="contained" endIcon={<ArrowRight size={16} />}>
        Open existing case · {order.caseId}
      </Button>
      <Button onClick={back} startIcon={<ArrowLeft size={16} />}>Back to results</Button>
    </div> : <>
      <div className={s.heroTags}><Tag tone="blue">Handled by {actor.name}</Tag><Tag>Delivery delay</Tag></div>
      {mutation.isError && <Alert severity="error" sx={{mt: 2}}>{errorMessage(mutation.error)}</Alert>}
      <form className={s.form} onSubmit={form.handleSubmit(input => mutation.mutate(input))} noValidate>
        <Controller name="customerName" control={form.control} render={({field, fieldState}) =>
          <TextField {...field} label="Customer name" required fullWidth disabled={mutation.isPending}
            error={!!fieldState.error} helperText={fieldState.error?.message} slotProps={{htmlInput: {maxLength: 100}}} />
        } />
        <Controller name="email" control={form.control} render={({field, fieldState}) =>
          <TextField {...field} label="Email" type="email" required fullWidth disabled={mutation.isPending}
            error={!!fieldState.error} helperText={fieldState.error?.message} slotProps={{htmlInput: {maxLength: 254}}} />
        } />
        <Controller name="notes" control={form.control} render={({field, fieldState}) =>
          <TextField {...field} label="Call notes" required multiline minRows={3} disabled={mutation.isPending}
            placeholder="What did the customer report?" error={!!fieldState.error} helperText={fieldState.error?.message}
            slotProps={{htmlInput: {maxLength: 500}}} />
        } />
        <div className={s.buttonRow}>
          <Button type="submit" variant="contained" disabled={mutation.isPending} endIcon={<ArrowRight size={16} />}>Create exception case</Button>
          <Button onClick={back} disabled={mutation.isPending} startIcon={<ArrowLeft size={16} />}>Back to results</Button>
        </div>
      </form>
    </>}
  </Card>;
}

export function RegisterCall({actor, token}: {actor: Actor; token: string}) {
  const [query, setQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [selected, setSelected] = useState<IntakeOrderMatch>();
  const [confirmation, setConfirmation] = useState<Confirmation>();
  const search = useMutation({mutationFn: (value: string) => searchOrders(token, value)});
  const back = () => {setSelected(undefined); setConfirmation(undefined);};

  return <div className={s.intakePage}>
    <header className={s.pageHeading}>
      <span className={s.eyebrow}>CUSTOMER SUPPORT INTAKE</span>
      <h1>Register a customer call</h1>
      <p>Find the order, confirm the delivery address, and record the exception.</p>
    </header>
    {actor.role !== 'agent' ? <Alert severity="info">Switch to the Agent role to register a call.</Alert> : <>
      <Stepper activeStep={confirmation ? 2 : selected ? 1 : 0} className={s.intakeStepper} alternativeLabel>
        {steps.map(step => <Step key={step}><StepLabel>{step}</StepLabel></Step>)}
      </Stepper>
      {confirmation ? <CreateCaseStep confirmation={confirmation} actor={actor} token={token} back={back} /> :
        selected ? <VerifyAddressStep order={selected} token={token} back={back} confirm={setConfirmation} /> :
          <Card title="Find an order" subtitle="Search by order number, customer name, email, or phone." icon={<Search size={19} />}>
            <form className={s.orderSearch} onSubmit={event => {
              event.preventDefault();
              const result = orderLookupSchema.safeParse(query);
              setSearchError(result.success ? '' : result.error.issues[0].message);
              if (result.success) search.mutate(result.data);
            }} noValidate>
              <TextField type="search" label="Order or customer" fullWidth value={query}
                error={!!searchError} helperText={searchError} disabled={search.isPending}
                placeholder="Order number, name, email, or phone"
                onChange={event => {setQuery(event.target.value); setSearchError('');}} />
              <Button type="submit" variant="contained" startIcon={<Search size={16} />} disabled={search.isPending}>Search orders</Button>
            </form>
            {search.isPending && <p role="status" className={s.muted}>Searching orders…</p>}
            {search.isError && <Alert severity="error">{errorMessage(search.error)}</Alert>}
            {search.data && <div className={s.orderResults}>
              <h3>Results for “{search.variables}”</h3>
              {search.data.length ? <ul aria-label="Matching orders">{search.data.map(order => <li key={order.orderId}>
                <OrderSummary order={order} />
                <Button onClick={() => setSelected(order)} aria-label={'Select order ' + order.orderId}
                  variant="outlined" endIcon={<ArrowRight size={16} />}>Select order</Button>
              </li>)}</ul> : <p className={s.muted}>No orders found. Check the order number or try another customer detail.</p>}
            </div>}
            <Button component={Link} to={queuePath} sx={{mt: 2}} startIcon={<ArrowLeft size={16} />}>Back to exceptions</Button>
          </Card>}
    </>}
  </div>;
}
