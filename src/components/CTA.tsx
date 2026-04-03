import { motion } from "motion/react";
import React, { useState } from "react";
import { api } from "../services/api";

type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

type CTAProps = {
  intro?: string;
};

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

function getErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: { data?: unknown } }).response?.data &&
    typeof (error as { response?: { data?: { error?: unknown } } }).response?.data?.error === "string"
  ) {
    return (error as { response: { data: { error: string } } }).response.data.error;
  }

  return fallback;
}

function validateContactForm(form: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (form.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (form.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters long.";
  }

  return errors;
}

export default function CTA({ intro }: CTAProps) {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");

  const handleChange =
    (field: keyof ContactFormData) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValue = event.target.value;
      setFormData((current) => ({ ...current, [field]: nextValue }));

      setFormErrors((current) => {
        if (!current[field]) {
          return current;
        }

        const nextErrors = validateContactForm({ ...formData, [field]: nextValue });
        return { ...current, [field]: nextErrors[field] };
      });

      if (status !== "idle") {
        setStatus("idle");
        setFeedbackMessage("");
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateContactForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setStatus("error");
      setFeedbackMessage("Please fix the highlighted fields before sending.");
      return;
    }

    setFormErrors({});
    setStatus("loading");
    setFeedbackMessage("");

    try {
      const response = await api.submitInquiry(formData);
      setStatus("success");
      setFeedbackMessage(response.message || "Thank you! We'll get back to you soon.");
      setFormData(initialFormData);
    } catch (error) {
      console.error("Submission failed:", error);
      setStatus("error");
      setFeedbackMessage(getErrorMessage(error, "We couldn't send your inquiry right now. Please try again."));
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-stone-900 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-headline mb-6 sm:mb-8"
          >
            Let's Create Your Dream Space
          </motion.h2>
          <p className="text-stone-400 text-base sm:text-lg">
            {intro ??
              "Whether you're starting from scratch or renovating a room, our team is ready to bring your vision to life."}
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 bg-white/5 p-5 sm:p-8 rounded-2xl border border-white/10"
        >
          <div className="space-y-2">
            <label htmlFor="contact-name" className="text-xs uppercase tracking-widest font-bold text-stone-400">Name</label>
            <input
              id="contact-name"
              required
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              disabled={status === "loading"}
              className={`w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none ${
                formErrors.name ? "border-red-400 bg-red-500/10" : "border-white/10 bg-white/10 focus:border-primary"
              }`}
              placeholder="John Doe"
              autoComplete="name"
            />
            {formErrors.name && <p className="text-sm text-red-300">{formErrors.name}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="contact-email" className="text-xs uppercase tracking-widest font-bold text-stone-400">Email</label>
            <input
              id="contact-email"
              required
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
              disabled={status === "loading"}
              className={`w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none ${
                formErrors.email ? "border-red-400 bg-red-500/10" : "border-white/10 bg-white/10 focus:border-primary"
              }`}
              placeholder="john@example.com"
              autoComplete="email"
            />
            {formErrors.email && <p className="text-sm text-red-300">{formErrors.email}</p>}
          </div>
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="contact-phone" className="text-xs uppercase tracking-widest font-bold text-stone-400">Phone</label>
            <input
              id="contact-phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange("phone")}
              disabled={status === "loading"}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
              placeholder="+62 812 3456 7890"
              autoComplete="tel"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label htmlFor="contact-message" className="text-xs uppercase tracking-widest font-bold text-stone-400">Message</label>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange("message")}
              disabled={status === "loading"}
              className={`w-full rounded-lg border px-4 py-3 transition-colors focus:outline-none ${
                formErrors.message ? "border-red-400 bg-red-500/10" : "border-white/10 bg-white/10 focus:border-primary"
              }`}
              placeholder="Tell us about your project..."
            />
            {formErrors.message && <p className="text-sm text-red-300">{formErrors.message}</p>}
          </div>
          <div className="md:col-span-2 flex flex-col items-center gap-4">
            <button
              disabled={status === "loading"}
              type="submit"
              className="w-full md:w-auto bg-primary text-on-primary px-8 sm:px-12 py-4 rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send Inquiry"}
            </button>
            {status === "success" && (
              <p className="text-center text-green-400 text-sm" role="status" aria-live="polite">
                {feedbackMessage}
              </p>
            )}
            {status === "error" && (
              <p className="text-center text-red-400 text-sm" role="alert">
                {feedbackMessage}
              </p>
            )}
          </div>
        </motion.form>
      </div>
    </section>
  );
}
