import React, { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Copy, Download, Printer, Repeat, Save, Send, TriangleAlert, Upload } from "lucide-react";

const timezones = [
  "IST (UTC+05:30)",
  "UTC",
  "PST (UTC-08:00)",
  "EST (UTC-05:00)",
  "CET (UTC+01:00)",
];

// Reduced options after field removals

const drillTypes = [
  "Fire Evacuation Drill",
  "Earthquake Response Drill",
  "Flood Emergency Drill",
  "Medical Emergency Drill",
  "Security Threat Drill",
  "Chemical Spill Response",
  "Full-Scale Exercise",
  "Tabletop Exercise",
] as const;

const schema = z.object({
  drillId: z.string(),
  title: z.string().min(3),
  type: z.enum(drillTypes),
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  timezone: z.string().min(1),
  recurring: z.boolean().optional(),
  recurringFrequency: z.string().optional(),
  location: z.string().min(1),
  buildingFloor: z.string().optional(),
  assemblyPoint: z.string().min(1),
  altLocation: z.string().optional(),
  // removed: latitude, longitude, coordinator, departments
  expectedParticipants: z.coerce.number().min(1),
  externalAgencies: z.array(z.string()).optional(),
  scenario: z.string().min(10),
  // removed: objectives, successCriteria, equipment, safety, weatherPlan,
  // noticePeriod, notifyMethods, commsPlan, observers, evalTemplate, reportTemplate, mandatoryParticipants
});

type FormValues = z.infer<typeof schema>;

function generateDrillId() {
  const now = new Date();
  const ts = now.toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DRILL-${ts}-${rand}`;
}

export default function MockDrillSchedule() {
  const navigate = useNavigate();
  const [now, setNow] = useState<string>(new Date().toLocaleString());
  const [saving, setSaving] = useState(false);
  const [nextDrillCountdown, setNextDrillCountdown] = useState<string>("--:--:--");
  const autoSaveTimer = useRef<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      drillId: generateDrillId(),
      title: "",
      type: "Fire Evacuation Drill",
      date: "",
      startTime: "",
      endTime: "",
      timezone: timezones[0],
      recurring: false,
      recurringFrequency: "",
      location: "",
      buildingFloor: "",
      assemblyPoint: "",
      altLocation: "",
      expectedParticipants: 10,
      externalAgencies: [],
      scenario: "",
      // removed fields default values
    },
    mode: "onChange",
  });

  // Live clock
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date().toLocaleString()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Auto-save
  const storageKey = "mock-drill-schedule-draft";
  useEffect(() => {
    const sub = form.watch((values) => {
      if (autoSaveTimer.current) window.clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = window.setTimeout(() => {
        setSaving(true);
        localStorage.setItem(storageKey, JSON.stringify(values));
        setSaving(false);
      }, 800);
    });
    return () => sub.unsubscribe();
  }, [form]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        form.reset({ ...data, drillId: data.drillId || generateDrillId() });
      } catch {}
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Derived duration
  const duration = useMemo(() => {
    const d = form.getValues();
    if (!d.startTime || !d.endTime) return "";
    const [sh, sm] = d.startTime.split(":").map(Number);
    const [eh, em] = d.endTime.split(":").map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    const diff = end - start;
    if (Number.isNaN(diff) || diff <= 0) return "";
    const h = Math.floor(diff / 60);
    const m = diff % 60;
    return `${h}h ${m}m`;
  }, [form.watch(["startTime", "endTime"])]);

  // Mock counters
  useEffect(() => {
    const id = window.setInterval(() => {
      setNextDrillCountdown((prev) => prev);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    console.log("SCHEDULE DRILL", values);
    localStorage.removeItem(storageKey);
    navigate("/admin");
  };

  const onSaveDraft = () => {
    const values = form.getValues();
    localStorage.setItem(storageKey, JSON.stringify(values));
  };

  const duplicatePrevious = () => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        form.reset({ ...data, drillId: generateDrillId() });
      } catch {}
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mock Drill Schedule Management</h1>
          <p className="text-sm text-muted-foreground">Emergency Response Training & Preparedness</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">Active Drills: 2</Badge>
          <Badge>Next Drill: {nextDrillCountdown}</Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span aria-live="polite">{now}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Main Form */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Drill</CardTitle>
              <CardDescription>Complete all required fields to schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField control={form.control} name="drillId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drill ID</FormLabel>
                        <FormControl>
                          <Input readOnly {...field} />
                        </FormControl>
                        <FormDescription>Auto-generated unique identifier</FormDescription>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drill Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Earthquake Response - Senior Block" maxLength={120} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField control={form.control} name="type" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drill Type *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {drillTypes.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="timezone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Zone *</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time zone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timezones.map((tz) => (
                              <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid gap-2">
                      <Label>Recurring Schedule</Label>
                      <div className="flex items-center gap-3">
                        <Checkbox checked={!!form.watch("recurring")} onCheckedChange={(v) => form.setValue("recurring", !!v)} />
                        <span className="text-sm">Enable</span>
                        <Select value={form.watch("recurringFrequency") || ""} onValueChange={(v) => form.setValue("recurringFrequency", v)}>
                          <SelectTrigger className="ml-2">
                            <SelectValue placeholder="Frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            {['Weekly', 'Monthly', 'Quarterly'].map((f) => (
                              <SelectItem key={f} value={f}>{f}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <FormField control={form.control} name="date" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheduled Date *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="startTime" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time *</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="endTime" render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time *</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid gap-2">
                      <Label>Duration</Label>
                      <Input readOnly value={duration} placeholder="--" />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField control={form.control} name="location" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Location *</FormLabel>
                        <FormControl>
                          <Input placeholder="Main Building" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="buildingFloor" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Building/Floor</FormLabel>
                        <FormControl>
                          <Input placeholder="Block A, 2nd Floor" {...field} />
                        </FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="assemblyPoint" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assembly Point *</FormLabel>
                        <FormControl>
                          <Input placeholder="Playground Assembly Area" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="altLocation" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternate Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Auditorium" {...field} />
                        </FormControl>
                      </FormItem>
                    )} />
                  </div>
                  {/* removed GPS coordinates */}

                  {/* Participants & Coordination */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField control={form.control} name="expectedParticipants" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Participants *</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    {/* removed Departments Involved and Coordinator */}
                  </div>
                  {/* removed Mandatory Participants */}
                  <FormField control={form.control} name="externalAgencies" render={() => (
                    <FormItem>
                      <FormLabel>External Agencies</FormLabel>
                      <div className="grid grid-cols-2 gap-2">
                        {["Fire Department", "Police", "Medical Services", "NDMA"].map((ag) => {
                          const checked = (form.watch("externalAgencies") || []).includes(ag);
                          return (
                            <label key={ag} className="flex items-center gap-2 rounded-md border p-2">
                              <Checkbox
                                checked={checked}
                                onCheckedChange={(val) => {
                                  const current = form.getValues("externalAgencies") || [];
                                  if (val) form.setValue("externalAgencies", Array.from(new Set([...current, ag])));
                                  else form.setValue("externalAgencies", current.filter((d: string) => d !== ag));
                                }}
                              />
                              <span>{ag}</span>
                            </label>
                          );
                        })}
                      </div>
                    </FormItem>
                  )} />

                  {/* Planning Details */}
                  <FormField control={form.control} name="scenario" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drill Scenario *</FormLabel>
                      <FormControl>
                        <Textarea rows={4} placeholder="Describe the simulated emergency scenario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  {/* removed objectives, success criteria, equipment, safety, weather contingency */}

                  {/* removed Notification & Communication section */}

                  {/* removed Evaluation and Documentation section */}

                  {/* Actions */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Button type="button" variant="secondary" onClick={onSaveDraft}>
                        <Save className="mr-2 h-4 w-4" /> Save as Draft
                      </Button>
                      <Button type="button" variant="outline" onClick={duplicatePrevious}>
                        <Copy className="mr-2 h-4 w-4" /> Duplicate Previous
                      </Button>
                      <Button type="button" variant="outline">
                        <Upload className="mr-2 h-4 w-4" /> Bulk Import
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button type="button" variant="outline" onClick={() => form.reset({ ...form.getValues(), drillId: generateDrillId() })}>Cancel</Button>
                      <Button type="button" variant="outline">
                        <Printer className="mr-2 h-4 w-4" /> Print Schedule
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="bg-primary">
                            <Send className="mr-2 h-4 w-4" /> Schedule Drill
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Drill Scheduling</AlertDialogTitle>
                            <AlertDialogDescription>Ensure all details are correct. Notifications will be prepared.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Review</AlertDialogCancel>
                            <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>Confirm</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Widgets */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Drills</CardTitle>
                <CardDescription>Next scheduled drills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="flex items-center justify-between rounded border p-2">
                    <div>
                      <div className="font-medium">Fire Evacuation Drill</div>
                      <div className="text-muted-foreground">2025-10-0{i} • 10:00</div>
                    </div>
                    <Badge>Scheduled</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Drill Results</CardTitle>
                <CardDescription>Summary of completed drills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {["Earthquake Response", "Security Threat", "Flood Emergency"].map((name, idx) => (
                  <div key={name} className="flex items-center justify-between rounded border p-2">
                    <div>
                      <div className="font-medium">{name}</div>
                      <div className="text-muted-foreground">Score: {90 - idx * 3}% • Participation: {95 - idx * 4}%</div>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status & Compliance</CardTitle>
              <CardDescription>System indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Compliance to required frequency</span>
                <Badge variant="secondary">80%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Active drills</span>
                <Badge>2</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>System status</span>
                <Badge variant="secondary">Operational</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Perform frequent tasks faster</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline"><TriangleAlert className="mr-2 h-4 w-4" /> Emergency Drill (Now)</Button>
              <Button variant="outline"><Repeat className="mr-2 h-4 w-4" /> Recurring Drill Setup</Button>
              <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Bulk Import CSV</Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1"><Printer className="mr-2 h-4 w-4" /> Print</Button>
                <Button variant="outline" className="flex-1"><Download className="mr-2 h-4 w-4" /> Export</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


