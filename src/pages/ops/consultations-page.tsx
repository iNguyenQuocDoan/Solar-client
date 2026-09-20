import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterChips } from "@/components/ui/chips";
import { Select } from "@/components/ui/field";
import { Progress } from "@/components/ui/lists";
import { PageHeader } from "@/components/ui/page-header";
import {
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
} from "@/components/ui/panel";
import { Stat, StatRow } from "@/components/ui/stat";
import { EmptyState } from "@/components/ui/states";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import {
  consultationRequests,
  requestsDirectory,
  requestStages,
  type RequestStage,
} from "@/data/ops";
import { QueryBoundary, useMockQuery } from "@/services/mock";

type StageFilter = RequestStage | "all";

export function OpsConsultationsPage() {
  const query = useMockQuery(["ops", "consultations"], {
    rows: consultationRequests,
    ...requestsDirectory,
  });
  const [stage, setStage] = useState<StageFilter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return consultationRequests.filter(
      (r) =>
        (stage === "all" || r.stage === stage) &&
        (!q ||
          r.id.toLowerCase().includes(q) ||
          r.homeowner.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q)),
    );
  }, [stage, search]);

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(rows.map((r) => r.id)));
  }
  function toggle(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <QueryBoundary query={query}>
      {(data) => (
        <>
          <PageHeader
            title="Consultation requests"
            description="Triage preliminary assessments, evaluate them and schedule site surveys."
            actions={
              <>
                <Button>Export CSV</Button>
                <Button
                  disabled={selected.size === 0}
                >
                  Bulk reassign{selected.size > 0 ? ` (${selected.size})` : ""}
                </Button>
              </>
            }
          />

          <StatRow className="mb-10 md:grid-cols-3 lg:max-w-2xl">
            <Stat label="Active intake" value={data.stats.activeIntake} />
            <Stat label="Average triage SLA" value={data.stats.avgTriageSla} />
            <Stat
              label="Survey backlog"
              value={data.stats.surveyBacklog}
              tone="warn"
            />
          </StatRow>

          <Panel>
            <PanelBody className="space-y-4">
              <FilterChips
                chips={requestStages}
                value={stage}
                onChange={setStage}
                label="Filter by stage"
              />
              <div className="flex flex-wrap items-center gap-3">
                <label className="relative block w-full md:max-w-xs">
                  <span className="sr-only">Search requests</span>
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Customer, request ID or address"
                    className="h-9 w-full rounded-md border border-line-2 bg-transparent px-3 text-[15px] placeholder:text-fg-3 focus:border-fg"
                  />
                </label>
                <Select aria-label="Assessment status" className="w-auto">
                  {data.filters.assessment.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Select>
                <Select aria-label="Current stage" className="w-auto">
                  {data.filters.stage.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Select>
                <Select aria-label="Assigned consultant" className="w-auto">
                  {data.filters.consultant.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Select>
                <Select aria-label="Intake window" className="w-auto">
                  {data.filters.window.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </Select>
              </div>
            </PanelBody>

            {rows.length === 0 ? (
              <PanelBody>
                <EmptyState
                  title="No requests match these filters"
                  description="Try another stage or clear the search."
                  action={
                    <Button
                      size="sm"
                      onClick={() => {
                        setStage("all");
                        setSearch("");
                      }}
                    >
                      Clear filters
                    </Button>
                  }
                />
              </PanelBody>
            ) : (
              <Table className="min-w-[1040px] text-[14px]">
                <thead>
                  <tr>
                    <Th className="w-10">
                      <input
                        type="checkbox"
                        aria-label="Select all visible"
                        checked={allSelected}
                        onChange={toggleAll}
                        className="size-4 accent-accent"
                      />
                    </Th>
                    <Th>Request</Th>
                    <Th>Homeowner</Th>
                    <Th>Property</Th>
                    <Th>Intake and SLA</Th>
                    <Th>Stage and highlights</Th>
                    <Th>Assigned</Th>
                    <Th>
                      <span className="sr-only">Action</span>
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <Tr
                      key={r.id}
                      className={
                        selected.has(r.id) ? "bg-accent-soft/40" : undefined
                      }
                    >
                      <Td>
                        <input
                          type="checkbox"
                          aria-label={`Select ${r.id}`}
                          checked={selected.has(r.id)}
                          onChange={() => toggle(r.id)}
                          className="size-4 accent-accent"
                        />
                      </Td>
                      <Td>
                        <p className="text-[14px] font-medium whitespace-nowrap">
                          {r.id}
                        </p>
                        <p className="text-[13px] text-fg-3">{r.type}</p>
                      </Td>
                      <Td>
                        <p className="font-medium">{r.homeowner}</p>
                        <p className="text-[13px] text-fg-3">{r.contact}</p>
                      </Td>
                      <Td>
                        <p className="whitespace-nowrap">{r.address}</p>
                        <p className="text-[13px] whitespace-nowrap text-fg-3">{r.city}</p>
                      </Td>
                      <Td>
                        <p className="tnum whitespace-nowrap">
                          {r.intake} <span className="text-fg-3">{r.age}</span>
                        </p>
                        <p
                          className={
                            r.slaTone === "warn"
                              ? "text-[13px] font-medium text-warn"
                              : "text-[13px] text-fg-3"
                          }
                        >
                          {r.sla}
                        </p>
                      </Td>
                      <Td>
                        <Badge tone={r.stageTone}>{r.stageLabel}</Badge>
                        <p className="mt-0.5 text-[13px] text-fg-3">
                          {r.highlights.map((h) => h.label).join(', ')}
                        </p>
                      </Td>
                      <Td>
                        {r.assignee ? (
                          <span className="flex items-center gap-2 whitespace-nowrap">
                            <Avatar name={r.assignee} size="sm" />
                            {r.assignee}
                          </span>
                        ) : (
                          <span className="text-fg-3">Unassigned</span>
                        )}
                      </Td>
                      <Td className="text-right">
                        <Button
                          size="sm"
                          variant={r.assignee ? "secondary" : "primary"}
                        >
                          {r.action}
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            )}

            <PanelFooter className="justify-between text-[14px] text-fg-2">
              <span className="tnum">
                Showing 1 to {rows.length} of {data.total} consultation requests
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 whitespace-nowrap">
                  Rows per page
                  <Select
                    className="h-8 w-auto"
                    aria-label="Rows per page"
                    defaultValue="10"
                  >
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </Select>
                </label>
                <nav
                  aria-label="Pagination"
                  className="flex items-center gap-1"
                >
                  <Button size="sm" variant="ghost" disabled>
                    Previous
                  </Button>
                  {[1, 2, 3].map((p) => (
                    <Button
                      key={p}
                      size="sm"
                      variant={p === 1 ? "primary" : "ghost"}
                      aria-current={p === 1 ? "page" : undefined}
                      className="tnum min-w-8 px-2"
                    >
                      {p}
                    </Button>
                  ))}
                  <span className="px-1 text-fg-3">...</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="tnum min-w-8 px-2"
                  >
                    5
                  </Button>
                  <Button size="sm" variant="ghost">
                    Next
                  </Button>
                </nav>
              </div>
            </PanelFooter>
          </Panel>

          <Panel className="mt-10">
            <PanelHeader title="Austin metro snapshot" />
            <PanelBody className="grid gap-6 md:grid-cols-3 md:divide-x md:divide-line">
              <div className="md:pr-6">
                <p className="text-[14px] font-medium">
                  Lead density by cluster
                </p>
                <ul className="mt-3 space-y-3">
                  {data.region.clusters.map((c) => (
                    <li key={c.area}>
                      <div className="mb-1 flex justify-between text-[14px]">
                        <span>{c.area}</span>
                        <span className="tnum text-fg-2">
                          {c.pct}% ({c.leads} leads)
                        </span>
                      </div>
                      <Progress
                        value={c.pct}
                        label={`${c.area} share of leads`}
                      />
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[13px] text-fg-3">
                  {data.region.clusterNote}
                </p>
              </div>
              <div className="md:px-6">
                <p className="text-[14px] font-medium">Triage response</p>
                <p className="tnum mt-2 text-2xl font-semibold">
                  {data.region.triage.avg}
                </p>
                <p className="text-[13px] text-fg-2">
                  Average first contact to scheduling
                </p>
                <Badge tone="ok" className="mt-2">
                  {data.region.triage.health}
                </Badge>
                <p className="mt-3 text-[13px] text-fg-3">
                  {data.region.triage.note}
                </p>
              </div>
              <div className="md:pl-6">
                <p className="text-[14px] font-medium">Field survey fleet</p>
                <p className="tnum mt-2 text-2xl font-semibold">
                  {data.region.fleet.vans}{" "}
                  <span className="text-[15px] font-normal text-fg-2">
                    vans active
                  </span>
                </p>
                <p className="mt-1 text-[14px] text-fg-2">
                  Next certified roof technician slot:{" "}
                  <span className="font-medium text-fg">
                    {data.region.fleet.nextSlot}
                  </span>{" "}
                  ({data.region.fleet.crew}).
                </p>
                <Button size="sm" className="mt-3">
                  Dispatch and route optimizer
                </Button>
              </div>
            </PanelBody>
          </Panel>
        </>
      )}
    </QueryBoundary>
  );
}
