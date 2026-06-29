"use client";

import { ServicesBackground } from "@/components/services-background";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowUpRight, Clock3, Mail } from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const ease = [0.22, 1, 0.36, 1] as const;

const CONTACT_EMAIL = "daniel.skyrud@hotmail.com";

const SERVICE_OPTIONS = [
  { value: "video", label: "Video" },
  { value: "photography", label: "Photography" },
  { value: "strategy", label: "Strategy" },
  { value: "post-production", label: "Post Production" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

const contactFormSchema = z.object({
  name: z.string().min(1, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  company: z.string().optional(),
  service: z.string().min(1, "Please select a service."),
  message: z
    .string()
    .min(10, "Please share a bit more about your project."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const fieldLabelClassName =
  "font-mono text-[10px] tracking-[0.22em] text-primary uppercase md:text-xs";

const fieldControlClassName =
  "border border-border bg-background/80 px-3 focus-visible:border-primary focus-visible:border-b-primary";

export function Contact() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [submitState, setSubmitState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState("");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      service: "",
      message: "",
    },
  });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.15"],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -20, -40]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], [16, -24]);
  const parallaxEnabled = !prefersReducedMotion;

  const fadeUp = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease },
        },
      };

  const stagger = prefersReducedMotion ? 0 : 0.12;
  const headerStagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
  };

  const formStagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: prefersReducedMotion ? 0 : 0.12,
      },
    },
  };

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitState("loading");
    setSubmitError("");

    const serviceLabel =
      SERVICE_OPTIONS.find((option) => option.value === values.service)
        ?.label ?? values.service;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          service: serviceLabel,
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      form.reset();
      setSubmitState("success");
    } catch (error) {
      setSubmitState("error");
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="services-texture relative overflow-hidden text-foreground"
    >
      <ServicesBackground
        scrollYProgress={scrollYProgress}
        enabled={parallaxEnabled}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 py-20 md:px-12 md:py-24 lg:px-16">
        <motion.div
          style={parallaxEnabled ? { y: headerY } : undefined}
          className="relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={headerStagger}
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
            <motion.div variants={fadeUp} className="relative z-10 max-w-xl">
              <h2 className="font-heading text-3xl font-bold tracking-tight md:text-5xl md:leading-[1.1]">
                Let&apos;s talk about your project
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                Share a few details and we&apos;ll get back to you with next
                steps — usually within one business day.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="hidden md:block">
              <motion.p
                aria-hidden
                className="pointer-events-none shrink-0 self-start font-heading text-[clamp(3.5rem,10vw,7.5rem)] leading-[0.85] font-bold tracking-tighter text-foreground/10 uppercase select-none md:pt-1 md:text-right"
                style={parallaxEnabled ? { y: watermarkY } : undefined}
              >
                Contact
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        <div className="mt-12 grid items-start gap-10 md:mt-14 md:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] md:gap-12 lg:mt-16 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16">
          <motion.aside
            className="flex min-w-0 flex-col gap-6 md:sticky md:top-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={headerStagger}
          >
            <motion.div
              variants={fadeUp}
              className="min-w-0 border border-border bg-card/70 p-6 backdrop-blur-sm md:p-8"
            >
              <p className="font-mono text-[10px] tracking-[0.22em] text-primary uppercase md:text-xs">
                Direct line
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-4 flex min-w-0 items-start gap-3 font-heading text-lg font-semibold tracking-tight transition-colors hover:text-primary md:text-xl lg:text-2xl"
              >
                <Mail
                  className="mt-0.5 size-5 shrink-0 text-primary"
                  strokeWidth={1.75}
                />
                <span className="min-w-0 break-all">{CONTACT_EMAIL}</span>
              </a>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                Prefer email? Send over a brief, timeline, or reference links
                and we&apos;ll pick up the conversation from there.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex items-start gap-3 border border-border bg-card/50 px-5 py-4 backdrop-blur-sm"
            >
              <Clock3
                className="mt-0.5 size-4 shrink-0 text-primary"
                strokeWidth={1.75}
                aria-hidden
              />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Typical response time is within 24 hours on business days.
              </p>
            </motion.div>
          </motion.aside>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={formStagger}
          >
            <motion.div
              variants={fadeUp}
              className="border border-border bg-card/90 p-6 backdrop-blur-sm md:p-8"
            >
              <form
                id="contact-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                <FieldGroup className="grid gap-5 md:grid-cols-2 md:gap-6">
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="contact-name"
                          className={fieldLabelClassName}
                        >
                          Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id="contact-name"
                          autoComplete="name"
                          placeholder="Your name"
                          aria-invalid={fieldState.invalid}
                          className={cn(fieldControlClassName, "h-11")}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="contact-email"
                          className={fieldLabelClassName}
                        >
                          Email
                        </FieldLabel>
                        <Input
                          {...field}
                          id="contact-email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@company.com"
                          aria-invalid={fieldState.invalid}
                          className={cn(fieldControlClassName, "h-11")}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="company"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="contact-company"
                          className={fieldLabelClassName}
                        >
                          Company
                        </FieldLabel>
                        <Input
                          {...field}
                          id="contact-company"
                          autoComplete="organization"
                          placeholder="Optional"
                          aria-invalid={fieldState.invalid}
                          className={cn(fieldControlClassName, "h-11")}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="service"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="contact-service"
                          className={fieldLabelClassName}
                        >
                          Service
                        </FieldLabel>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            id="contact-service"
                            aria-invalid={fieldState.invalid}
                            className={cn(
                              fieldControlClassName,
                              "w-full data-[size=default]:h-11"
                            )}
                          >
                            <SelectValue placeholder="What do you need?" />
                          </SelectTrigger>
                          <SelectContent alignItemWithTrigger>
                            {SERVICE_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="message"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="md:col-span-2"
                      >
                        <FieldLabel
                          htmlFor="contact-message"
                          className={fieldLabelClassName}
                        >
                          Project details
                        </FieldLabel>
                        <Textarea
                          {...field}
                          id="contact-message"
                          placeholder="Tell us about the project, timeline, and where the content will be used."
                          aria-invalid={fieldState.invalid}
                          className={cn(
                            fieldControlClassName,
                            "min-h-32 resize-y py-3 leading-relaxed"
                          )}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitState === "loading"}
                    data-icon="inline-end"
                  >
                    {submitState === "loading" ? "Sending..." : "Send message"}
                    <ArrowUpRight className="size-4" />
                  </Button>

                  {submitState === "success" && (
                    <p role="status" className="text-sm text-primary">
                      Message sent — we&apos;ll be in touch soon.
                    </p>
                  )}

                  {submitState === "error" && submitError && (
                    <p role="alert" className="text-sm text-destructive">
                      {submitError}
                    </p>
                  )}
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
