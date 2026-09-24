export type PageKind = "lecture" | "notes" | "practice" | "concepts" | "lab";

export const PAGE_LABELS: Record<PageKind, string> = {
  lecture: "Lecture",
  notes: "Notes",
  practice: "Practice",
  concepts: "Concepts",
  lab: "Lab",
};

export type Day = {
  slug: string;
  title: string;
  pages: PageKind[];
  /**
   * Present only for a day that's a group of self-study topics rather than a single
   * lecture day — `pages` stays empty and these are nested under it instead.
   */
  topics?: Topic[];
};

/** One self-study topic nested under a topic-group day, e.g. "Additional Backend Topics". */
export type Topic = {
  /** URL segment and folder name, nested under the day's, e.g. "node-event-loop-deep-dive". */
  slug: string;
  title: string;
  /** No lecture and (so far) no lab for a topic — typically notes, practice, concepts. */
  pages: PageKind[];
  /**
   * Present instead of `pages` for a reference topic too big for one notes page (see
   * "Full SQL"): each part is its own standalone page under the topic's folder.
   */
  parts?: TopicPart[];
};

/** One page of a multi-page topic; the topic names its own pages. */
export type TopicPart = {
  /** URL segment and file name stem, e.g. "query-optimization" → `QueryOptimization.tsx`. */
  slug: string;
  title: string;
  /** Which of the topic's two halves this part belongs to, e.g. "Foundation" / "Advanced". */
  group: string;
  /** One line, shown on Home under the part's title. */
  blurb: string;
};

export type Week = {
  slug: string;
  number: number;
  title: string;
  days: Day[];
};

const ALL: PageKind[] = ["lecture", "notes", "practice", "concepts", "lab"];

export const WEEKS: Week[] = [
  {
    slug: "week1",
    number: 1,
    title: "Web Dev Fundamentals",
    days: [
      { slug: "day1-html-css-dom", title: "HTML & CSS", pages: ALL },
      {
        slug: "day2-typescript-core",
        title: "TypeScript Core",
        pages: ALL,
      },
      {
        slug: "day3-javascript-core",
        title: "JavaScript Core",
        pages: ALL,
      },
      {
        slug: "day4-js-functions",
        title: "JS Functions",
        pages: ALL,
      },
      {
        slug: "day5-promises-apis",
        title: "Promises & APIs",
        pages: ALL,
      },
    ],
  },
  {
    slug: "week2",
    number: 2,
    title: "React Fundamentals",
    days: [
      {
        slug: "day6-components-basics",
        title: "Components Basics: Describing the UI",
        pages: ALL,
      },
      {
        slug: "day7-state-interactivity",
        title: "State & Interactivity",
        pages: ALL,
      },
      {
        slug: "day8-inputs-forms",
        title: "Inputs & Forms",
        pages: ALL,
      },
      {
        slug: "day9-side-effects-data-fetching",
        title: "Side Effects & Data Fetching",
        pages: ALL,
      },
      {
        slug: "day10-routing-global-state",
        title: "Routing & Global State",
        pages: ALL,
      },
    ],
  },
  {
    slug: "week3",
    number: 3,
    title: "Node.js Backend Fundamentals",
    days: [
      {
        slug: "day11-node-express",
        title: "Node & Express",
        pages: ALL,
      },
      {
        slug: "day12-relational-databases",
        title: "Relational Databases",
        pages: ALL,
      },
      {
        slug: "day13-layered-architecture",
        title: "Layered Architecture",
        pages: ALL,
      },
      {
        slug: "day14-database-performance",
        title: "Database Performance",
        pages: ["lecture", "notes"],
      },
      {
        slug: "additional-backend-topics",
        title: "Additional Backend Topics",
        pages: [], // the group itself has no pages — its topics do
        topics: [
          {
            slug: "full-sql",
            title: "Full SQL — the complete reference behind days 12 & 14",
            pages: [], // this topic is split into parts instead
            parts: [
              {
                slug: "foundation",
                title: "Foundation",
                group: "Foundation",
                blurb:
                  "Types, DDL, the shape of a query, CRUD, filtering, sorting, aggregates, relationships, every join, constraints, transactions.",
              },
              {
                slug: "query-optimization",
                title: "Query Optimization",
                group: "Advanced",
                blurb: "N+1 in every disguise, EXPLAIN ANALYZE line by line, and indexes in depth.",
              },
              {
                slug: "scaling-and-throughput",
                title: "Scaling & Throughput",
                group: "Advanced",
                blurb:
                  "Batch operations, keyset vs. offset pagination, partitioning, sharding, read replicas, connection pooling.",
              },
              {
                slug: "schema-design",
                title: "Schema Design & Evolution",
                group: "Advanced",
                blurb: "1NF through 3NF, when to denormalize on purpose, and how migrations work.",
              },
              {
                slug: "sql-vs-nosql",
                title: "SQL vs. NoSQL",
                group: "Advanced",
                blurb:
                  "Term by term, ACID vs. BASE, the same query both ways, and how real systems use both at once.",
              },
            ],
          },
          {
            slug: "node-event-loop-deep-dive",
            title: "Node.js Event Loop Deep Dive",
            pages: ["notes", "concepts"],
          },
        ],
      },
    ],
  },
];

/** Standalone notes that belong to no week — the cross-cutting "how to work" material. */
export type GeneralNote = { slug: string; title: string; blurb: string };

export const GENERAL_NOTES: GeneralNote[] = [
  {
    slug: "ide-shortcuts",
    title: "Common Developer IDE Shortcuts",
    blurb:
      "The everyday editor shortcuts worth making automatic, Mac and Windows side by side.",
  },
  {
    slug: "common-sense",
    title: "Developer Common Sense",
    blurb:
      "The habits that make everything else faster — red lines, logging, formatting, terminals.",
  },
];

export function dayNumber(day: Day): number {
  return Number(day.slug.match(/^day(\d+)/)?.[1] ?? NaN);
}

export function pageHref(week: string, day: string, page: PageKind): string {
  return `/${week}/${day}/${page}`;
}

/** The URL for one page of one topic nested under a topic-group day. */
export function topicPageHref(week: string, day: string, topic: string, page: PageKind): string {
  return `/${week}/${day}/${topic}/${page}`;
}

/** The URL for one part of a multi-page topic, e.g. ".../full-sql/query-optimization". */
export function topicPartHref(week: string, day: string, topic: string, part: string): string {
  return `/${week}/${day}/${topic}/${part}`;
}

export function findWeekByDaySlug(daySlug: string): Week | undefined {
  return WEEKS.find((w) => w.days.some((d) => d.slug === daySlug));
}
