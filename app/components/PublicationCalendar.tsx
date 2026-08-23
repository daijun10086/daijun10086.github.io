"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PublicationEntry } from "../../content/post-types";

const WEEK_COUNT = 26;
const DAYS_PER_WEEK = 7;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function parseDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, amount: number) {
  return new Date(date.getTime() + amount * DAY_IN_MS);
}

function startOfMondayWeek(date: Date) {
  const distanceFromMonday = (date.getUTCDay() + 6) % DAYS_PER_WEEK;
  return addDays(date, -distanceFromMonday);
}

function kindLabel(kind: PublicationEntry["kind"]) {
  return kind === "research" ? "Research" : "Blog";
}

type PublicationCalendarProps = {
  entries: PublicationEntry[];
};

export function PublicationCalendar({ entries }: PublicationCalendarProps) {
  const entriesByDate = useMemo(() => {
    const grouped = new Map<string, PublicationEntry[]>();

    for (const entry of entries) {
      const existing = grouped.get(entry.date) ?? [];
      existing.push(entry);
      grouped.set(entry.date, existing);
    }

    return grouped;
  }, [entries]);

  const latestDate = entries[0]?.date ?? "";
  const [selectedDate, setSelectedDate] = useState(latestDate);

  const weeks = useMemo(() => {
    if (!latestDate) return [];

    const lastWeek = startOfMondayWeek(parseDate(latestDate));
    const firstWeek = addDays(lastWeek, -(WEEK_COUNT - 1) * DAYS_PER_WEEK);

    return Array.from({ length: WEEK_COUNT }, (_, weekIndex) =>
      Array.from({ length: DAYS_PER_WEEK }, (_, dayIndex) =>
        addDays(firstWeek, weekIndex * DAYS_PER_WEEK + dayIndex),
      ),
    );
  }, [latestDate]);

  const monthLabels = useMemo(
    () =>
      weeks.flatMap((week, weekIndex) => {
        const monthStart = week.find((day) => day.getUTCDate() === 1);
        if (weekIndex !== 0 && !monthStart) return [];

        return [
          {
            label: monthFormatter.format(monthStart ?? week[0]),
            weekIndex,
          },
        ];
      }),
    [weeks],
  );

  if (entries.length === 0) return null;

  const selectedEntries = entriesByDate.get(selectedDate) ?? [];

  return (
    <section className="publication-calendar" aria-labelledby="publication-calendar-title">
      <div className="publication-calendar-header">
        <div>
          <h2 id="publication-calendar-title">Publishing history</h2>
          <p>Research and Blog · last 26 weeks</p>
        </div>
        <div className="publication-calendar-legend" aria-label="Publication types">
          <span>
            <i className="publication-swatch is-research" aria-hidden="true" />
            Research
          </span>
          <span>
            <i className="publication-swatch is-blog" aria-hidden="true" />
            Blog
          </span>
        </div>
      </div>

      <div className="publication-calendar-scroll">
        <div className="publication-calendar-chart">
          <div className="publication-months" aria-hidden="true">
            {monthLabels.map(({ label, weekIndex }) => (
              <span key={`${label}-${weekIndex}`} style={{ gridColumnStart: weekIndex + 1 }}>
                {label}
              </span>
            ))}
          </div>

          <div className="publication-weekdays" aria-hidden="true">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          <div className="publication-days">
            {weeks.flatMap((week) =>
              week.map((day) => {
                const key = dateKey(day);
                const dayEntries = entriesByDate.get(key) ?? [];
                const hasResearch = dayEntries.some((entry) => entry.kind === "research");
                const hasBlog = dayEntries.some((entry) => entry.kind === "blog");
                const activityClass = hasResearch && hasBlog
                  ? "is-mixed"
                  : hasResearch
                    ? "is-research"
                    : hasBlog
                      ? "is-blog"
                      : "";

                if (dayEntries.length === 0) {
                  return <span className="publication-day" key={key} aria-hidden="true" />;
                }

                const entrySummary = dayEntries
                  .map((entry) => `${kindLabel(entry.kind)}: ${entry.title}`)
                  .join("; ");

                return (
                  <button
                    type="button"
                    className={`publication-day ${activityClass}`}
                    key={key}
                    aria-label={`${longDateFormatter.format(day)} — ${entrySummary}`}
                    aria-pressed={selectedDate === key}
                    onClick={() => setSelectedDate(key)}
                  />
                );
              }),
            )}
          </div>
        </div>
      </div>

      <div className="publication-calendar-selection" aria-live="polite">
        <time dateTime={selectedDate}>{longDateFormatter.format(parseDate(selectedDate))}</time>
        <ul>
          {selectedEntries.map((entry) => (
            <li key={`${entry.kind}-${entry.slug}`}>
              <Link href={`/writing/${entry.slug}`}>{entry.title}</Link>
              <span className={`publication-kind is-${entry.kind}`}>{kindLabel(entry.kind)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
