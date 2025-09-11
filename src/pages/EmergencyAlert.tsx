import React, { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, MapPin, Clock3, Save, Send, Eye, RefreshCw, X, UploadCloud } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const alertTypes = [
  { group: "Natural Disaster", items: ["Earthquake", "Flood", "Hurricane", "Wildfire", "Tsunami", "Landslide"] },
  { group: "Man-made Emergency", items: ["Fire", "Chemical Spill", "Industrial Accident", "Transportation Emergency"] },
  { group: "Weather Alert", items: ["Storm", "Extreme Temperature", "Severe Weather Warning"] },
  { group: "Public Safety", items: ["Security Threat", "Evacuation", "Power Outage", "Public Health Emergency"] },
];

const distributionChannels = [
  "SMS/Text Alerts",
  "Email Notifications",
  "Social Media",
  "Emergency Broadcast System",
  "Mobile App Push Notifications",
];

const priorityOptions = ["Immediate", "Urgent", "Standard"] as const;
const severityOptions = ["Critical", "High", "Medium", "Low"] as const;

type Priority = typeof priorityOptions[number];
type Severity = typeof severityOptions[number];

// Form schema
const schema = z.object({
  alertId: z.string(),
  title: z.string().min(4).max(120),
  type: z.string().min(1, "Select alert type"),
  severity: z.enum(severityOptions, { required_error: "Select severity" }),
  priority: z.enum(priorityOptions, { required_error: "Select priority" }),
  area: z.string().min(3, "Enter affected area"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  incidentDate: z.string().min(1, "Date required"),
  incidentTime: z.string().min(1, "Time required"),
  expectedDuration: z.string().optional(),
  description: z.string().min(20, "Add more detail (20+ chars)"),
  instructions: z.string().min(5, "Provide safety instructions"),
  resourcesNeeded: z.string().optional(),
  contact: z.string().min(5, "Provide contact info"),
  channels: z.array(z.string()).min(1, "Select at least one channel"),
  files: z
    .any()
    .refine((files) => !files || (files instanceof FileList && Array.from(files).every((f) => f.size <= MAX_FILE_SIZE_BYTES)), `Each file must be <= ${MAX_FILE_SIZE_MB}MB`)
    .optional(),
});

type AlertFormValues = z.infer<typeof schema>;

const TEMPLATES: Record<string, Partial<AlertFormValues>> = {
  "Earthquake Warning": {
    title: "Earthquake Warning",
    type: "Earthquake",
    severity: "Critical",
    priority: "Immediate",
    instructions: "Drop, Cover, and Hold On. Move to open areas away from buildings.",
    description: "Seismic activity detected. Strong shaking expected. Immediate protective actions advised.",
    channels: ["SMS/Text Alerts", "Mobile App Push Notifications"],
  },
  "Flood Emergency": {
    title: "Flood Emergency",
    type: "Flood",
    severity: "High",
    priority: "Urgent",
    instructions: "Move to higher ground. Avoid walking or driving through flood waters.",
    description: "Rapid water level rise detected. Evacuation may be necessary in low-lying areas.",
    channels: ["SMS/Text Alerts", "Email Notifications", "Social Media"],
  },
  "Public Safety Threat": {
    title: "Public Safety Threat",
    type: "Security Threat",
    severity: "High",
    priority: "Immediate",
    instructions: "Shelter in place. Lock doors and remain away from windows until further notice.",
    description: "Security threat reported in the vicinity. Follow official instructions and await updates.",
    channels: ["Emergency Broadcast System", "Mobile App Push Notifications"],
  },
};

function generateAlertId() {
  const now = new Date();
  const ts = now.toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ALRT-${ts}-${rand}`;
}

export default function EmergencyAlert() {
  const navigate = useNavigate();
  const [now, setNow] = useState<string>(new Date().toLocaleString());
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const autosaveTimer = useRef<number | null>(null);

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      alertId: generateAlertId(),
      title: "",
      type: "",
      severity: "Medium",
      priority: "Standard",
      area: "",
      latitude: "",
      longitude: "",
      incidentDate: "",
      incidentTime: "",
      expectedDuration: "",
      description: "",
      instructions: "",
      resourcesNeeded: "",
      contact: "",
      channels: [],
      files: undefined,
    },
    mode: "onChange",
  });

  // Live clock
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date().toLocaleString()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Autosave to localStorage
  const storageKey = "emergency-alert-draft";
  useEffect(() => {
    const sub = form.watch((values) => {
      if (autosaveTimer.current) window.clearTimeout(autosaveTimer.current);
      autosaveTimer.current = window.setTimeout(() => {
        setSaving(true);
        localStorage.setItem(storageKey, JSON.stringify(values));
        setSaving(false);
      }, 800);
    });
    return () => sub.unsubscribe();
  }, [form]);

  // Load draft if present
  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        form.reset({ ...data, alertId: data.alertId || generateAlertId() });
      } catch {}
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Completion progress
  const progress = useMemo(() => {
    const v = form.getValues();
    const requiredKeys: (keyof AlertFormValues)[] = [
      "title",
      "type",
      "severity",
      "priority",
      "area",
      "incidentDate",
      "incidentTime",
      "description",
      "instructions",
      "contact",
      "channels",
    ];
    const total = requiredKeys.length;
    let filled = 0;
    requiredKeys.forEach((k) => {
      const val = (v as any)[k];
      if (Array.isArray(val)) {
        if (val.length > 0) filled += 1;
      } else if (typeof val === "string") {
        if (val.trim().length > 0) filled += 1;
      } else if (val) filled += 1;
    });
    return Math.round((filled / total) * 100);
  }, [form.watch()]);

  const applyTemplate = (templateName: string) => {
    const t = TEMPLATES[templateName];
    if (!t) return;
    form.reset({ ...form.getValues(), ...t });
  };

  const tryGeolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      form.setValue("latitude", pos.coords.latitude.toFixed(6));
      form.setValue("longitude", pos.coords.longitude.toFixed(6));
    });
  };

  const onSubmit = async (values: AlertFormValues) => {
    try {
      setServerError(null);
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          files: values.files ? Array.from(values.files as FileList).map((f: File) => ({ name: f.name, size: f.size })) : undefined,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          const message = data?.message || data?.error || JSON.stringify(data);
          setServerError(String(message));
        } catch {
          setServerError(text || 'Failed to submit alert');
        }
        return;
      }
      localStorage.removeItem(storageKey);
      navigate('/admin');
    } catch (e) {
      setSaving(false);
      setServerError('Failed to submit alert. Please try again.');
    }
  };

  const onSaveDraft = () => {
    const values = form.getValues();
    localStorage.setItem(storageKey, JSON.stringify(values));
  };

  const onClear = () => {
    form.reset({
      alertId: generateAlertId(),
      title: "",
      type: "",
      severity: "Medium",
      priority: "Standard",
      area: "",
      latitude: "",
      longitude: "",
      incidentDate: "",
      incidentTime: "",
      expectedDuration: "",
      description: "",
      instructions: "",
      resourcesNeeded: "",
      contact: "",
      channels: [],
      files: undefined,
    });
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSaveDraft();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        // trigger confirmation dialog by clicking hidden trigger
        const btn = document.getElementById("confirm-submit-trigger");
        btn?.click();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600 text-white">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Emergency Alert System</h1>
            <p className="text-sm text-muted-foreground">Create, manage, and distribute disaster alerts swiftly and accurately.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="destructive">Active Alerts: 3</Badge>
          <Badge>System: Operational</Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="h-4 w-4" />
            <span aria-live="polite">{now}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Disaster Management Alert</CardTitle>
              <CardDescription>Fields marked with <span className="text-red-600">*</span> are required.</CardDescription>
            </CardHeader>
            <CardContent>
              {serverError && (
                <div className="mb-4 rounded border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  {serverError}
                </div>
              )}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Basic Details */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="alertId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alert ID</FormLabel>
                          <FormControl>
                            <Input readOnly {...field} />
                          </FormControl>
                          <FormDescription>Auto-generated unique identifier</FormDescription>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Alert Title <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Flood Emergency in Riverside District" maxLength={120} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Alert Type <span className="text-red-600">*</span>
                          </FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {alertTypes.map((g) => (
                                <div key={g.group}>
                                  <div className="px-2 py-1 text-xs text-muted-foreground">{g.group}</div>
                                  {g.items.map((it) => (
                                    <SelectItem key={it} value={it}>
                                      {it}
                                    </SelectItem>
                                  ))}
                                  <Separator className="my-2" />
                                </div>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Severity Level <span className="text-red-600">*</span>
                          </FormLabel>
                          <RadioGroup className="grid grid-cols-2 gap-2" value={field.value} onValueChange={field.onChange}>
                            {severityOptions.map((s) => (
                              <FormItem key={s} className="flex items-center gap-2 rounded-md border p-2">
                                <FormControl>
                                  <RadioGroupItem value={s} />
                                </FormControl>
                                <FormLabel className={`font-medium ${
                                  s === "Critical" ? "text-red-600" : s === "High" ? "text-orange-600" : s === "Medium" ? "text-yellow-600" : "text-green-600"
                                }`}>
                                  {s}
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Priority Status <span className="text-red-600">*</span>
                          </FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {priorityOptions.map((p) => (
                                <SelectItem key={p} value={p}>
                                  {p}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Location & Time */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Affected Area <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="City, district, campus, etc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Latitude</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 28.6139" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="longitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Longitude</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 77.2090" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" size="sm" onClick={tryGeolocate}>
                      <MapPin className="mr-2 h-4 w-4" /> Use Current Location
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="incidentDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Incident Date <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="incidentTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Incident Time <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expectedDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expected Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 3 hours" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Content */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Alert Description <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea rows={5} maxLength={2000} placeholder="Detailed description of the incident, impact, and context" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Instructions <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea rows={4} maxLength={1000} placeholder="Public safety instructions and guidance" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="resourcesNeeded"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resources Needed</FormLabel>
                        <FormControl>
                          <Textarea rows={3} maxLength={500} placeholder="e.g., Ambulances, Fire Units, Rescue Boats, Medical Supplies" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Contact Information <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Emergency Operations Center: +91-XXXXXXXXXX" maxLength={120} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Distribution Channels */}
                  <FormField
                    control={form.control}
                    name="channels"
                    render={() => (
                      <FormItem>
                        <FormLabel>
                          Distribution Channels <span className="text-red-600">*</span>
                        </FormLabel>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {distributionChannels.map((ch) => {
                            const checked = form.watch("channels").includes(ch);
                            return (
                              <label key={ch} className="flex items-center gap-2 rounded-md border p-2">
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(val) => {
                                    const current = form.getValues("channels");
                                    if (val) form.setValue("channels", Array.from(new Set([...current, ch])));
                                    else form.setValue("channels", current.filter((c) => c !== ch));
                                  }}
                                />
                                <span>{ch}</span>
                              </label>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Files */}
                  <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media Attachments</FormLabel>
                        <FormDescription>Images/documents up to {MAX_FILE_SIZE_MB}MB each</FormDescription>
                        <FormControl>
                          <div className="flex items-center gap-3">
                            <Input type="file" multiple onChange={(e) => field.onChange(e.target.files)} />
                            <UploadCloud className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Actions */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Button type="button" variant="secondary" onClick={onSaveDraft}>
                        <Save className="mr-2 h-4 w-4" /> Save Draft (Ctrl+S)
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setPreviewOpen(true)}>
                        <Eye className="mr-2 h-4 w-4" /> Preview
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button type="button" variant="outline" onClick={onClear}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Clear Form
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => navigate("/admin")}>Cancel</Button>

                      {/* Confirmation before submit */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button id="confirm-submit-trigger" type="button" className="bg-red-600 hover:bg-red-700">
                            <Send className="mr-2 h-4 w-4" /> Submit Alert
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Submit this alert?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Please confirm the alert details. Distribution will proceed through selected channels.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Review</AlertDialogCancel>
                            <AlertDialogAction onClick={form.handleSubmit(onSubmit)}>Confirm & Submit</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Templates</CardTitle>
              <CardDescription>Apply a preset to pre-fill common fields.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.keys(TEMPLATES).map((t) => (
                <Button key={t} variant="outline" className="w-full justify-start" onClick={() => applyTemplate(t)}>
                  {t}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Status</CardTitle>
              <CardDescription>Completion progress and autosave state.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Completion</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
              <div className="mt-3 text-xs text-muted-foreground">Autosave: {saving ? "Saving..." : "All changes saved"}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Summary of the latest system alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Flood Emergency • Riverside</span>
                <Badge variant="secondary">High</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Power Outage • Sector 12</span>
                <Badge variant="secondary">Medium</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Security Threat • Campus A</span>
                <Badge variant="secondary">High</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Simple preview modal as a card below when opened */}
      {previewOpen && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Review the alert content before submitting.</CardDescription>
              </div>
              <Button variant="ghost" onClick={() => setPreviewOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <pre className="whitespace-pre-wrap break-words rounded-md bg-muted p-3">{JSON.stringify(form.getValues(), null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


