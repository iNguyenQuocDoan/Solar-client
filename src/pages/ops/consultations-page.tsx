import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterChips } from "@/components/ui/chips";
import { Input, Select } from "@/components/ui/field";
import { FilterBar } from "@/components/ui/filter-bar";
import { Progress } from "@/components/ui/lists";
import { PageHeader } from "@/components/ui/page-header";
import {
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
} from "@/components/ui/panel";
import { Pagination } from "@/components/ui/pagination";
import { Stat, StatRow } from "@/components/ui/stat";
import { EmptyState } from "@/components/ui/states";
import { Table, Td, Th, Tr } from "@/components/ui/table";
import {
  consultationRequests,
  requestsDirectory,
  requestStages,
  type RequestStage,
} from "@/data/ops";
import { cx } from "@/lib/cx";
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

          <StatRow className="mb-12 md:grid-cols-3 lg:max-w-2xl">
            <Stat label="Active intake" value={data.stats.activeIntake} />
            <Stat label="Average triage SLA" value={data.stats.avgTriageSla} />
            <Stat
              label="Survey backlog"
              value={data.stats.surveyBacklog}
              tone="warn"
            />
          </StatRow>

          <Panel>
            <FilterBar
              tabs={
                <FilterChips
                  chips={requestStages}
                  value={stage}
                  onChange={setStage}
                  label="Filter by stage"
                />
              }
            >
                <Input
                  type="search"
                  aria-label="Search requests"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Customer, request ID or address"
                  className="w-full md:max-w-xs"
                />
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
            </FilterBar>

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
              <Table stack>
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
                    <Th className="hidden 2xl:table-cell">Property</Th>
                    <Th className="hidden lg:table-cell">Intake and SLA</Th>
                    <Th>Stage and highlights</Th>
                    <Th className="hidden md:table-cell">Assigned</Th>
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
                      <Td label="Request">
                        <p className="font-medium whitespace-nowrap">{r.id}</p>
                        <p className="text-meta text-fg-3 wide:whitespace-nowrap">{r.type}</p>
                      </Td>
                      <Td label="Homeowner">
                        <p className="font-medium wide:whitespace-nowrap">{r.homeowner}</p>
                        <p className="text-meta text-fg-3">{r.contact}</p>
                      </Td>
                      <Td label="Property" className="hidden 2xl:table-cell">
                        <p className="whitespace-nowrap">{r.address}</p>
                        <p className="text-meta text-fg-3">{r.city}</p>
                      </Td>
                      <Td label="Intake and SLA" className="hidden lg:table-cell">
                        <p className="tnum">
                          <span className="whitespace-nowrap">{r.intake}</span> <span className="whitespace-nowrap text-fg-3">{r.age}</span>
                        </p>
                        <p
                          className={cx(
                            "text-meta",
                            r.slaTone === "warn" ? "font-medium text-warn" : "text-fg-3",
                          )}
                        >
                          {r.sla}
                        </p>
                      </Td>
                      <Td label="Stage and highlights">
                        <Badge tone={r.stageTone}>{r.stageLabel}</Badge>
                        <p className="text-meta text-fg-3">
                          {r.highlights.map((h) => h.label).join(', ')}
                        </p>
                      </Td>
                      <Td label="Assigned" className="hidden md:table-cell">
                        {r.assignee ? (
                          <span className="whitespace-nowrap">{r.assignee}</span>
                        ) : (
                          <span className="text-fg-3">Unassigned</span>
                        )}
                      </Td>
                      <Td className="text-right">
                        <Button size="sm">{r.action}</Button>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            )}

            <PanelFooter className="justify-between text-body text-fg-2">
              <span className="tnum">
                Showing 1 to {rows.length} of {data.total} consultation requests
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 whitespace-nowrap">
                  Rows per page
                  <Select
                    size="sm"
                    className="w-auto"
                    aria-label="Rows per page"
                    defaultValue="10"
                  >
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                  </Select>
                </label>
                <Pagination page={1} pages={5} />
              </div>
            </PanelFooter>
          </Panel>

          <Panel className="mt-12">
            <PanelHeader title="Austin metro snapshot" />
            <PanelBody className="grid gap-6 lg:grid-cols-3 lg:divide-x lg:divide-line">
              <div className="lg:pr-6">
                <p className="text-body font-medium">
                  Lead density by cluster
                </p>
                <ul className="mt-3 space-y-3">
                  {data.region.clusters.map((c) => (
                    <li key={c.area}>
                      <div className="mb-1 flex justify-between text-body">
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
                <p className="mt-3 text-meta text-fg-3">
                  {data.region.clusterNote}
                </p>
              </div>
              <div className="lg:px-6">
                <p className="text-body font-medium">Triage response</p>
                <p className="tnum mt-2 text-figure font-semibold">
                  {data.region.triage.avg}
                </p>
                <p className="text-meta text-fg-3">
                  Average first contact to scheduling
                </p>
                <Badge tone="ok" className="mt-2">
                  {data.region.triage.health}
                </Badge>
                <p className="mt-3 text-meta text-fg-3">
                  {data.region.triage.note}
                </p>
              </div>
              <div className="lg:pl-6">
                <p className="text-body font-medium">Field survey fleet</p>
                <p className="tnum mt-2 text-figure font-semibold">
                  {data.region.fleet.vans}{" "}
                  <span className="text-body font-normal text-fg-2">
                    vans active
                  </span>
                </p>
                <p className="mt-1 text-body text-fg-2">
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
