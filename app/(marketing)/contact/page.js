"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageHero } from "@/components/layout/PageHero";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { contactContent } from "@/lib/mock/pageContent";
import { contactBlocks } from "@/lib/mock/homeData";
import {
  HiOutlineClock,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { staggerContainer, staggerItem, viewportOnce } from "@/components/home/motion";

const icons = [HiOutlineClock, HiOutlinePhone, HiOutlineEnvelope, HiOutlineMapPin];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero
        title={contactContent.hero.title}
        subtitle={contactContent.hero.subtitle}
        description={contactContent.hero.description}
        image={contactContent.hero.image}
      />

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.form
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <h2 className="font-serif text-2xl font-semibold text-ocean-950">
                Send us a message
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                A member specialist will respond within one business day.
              </p>
              <div className="mt-8 space-y-5">
                <Input label="Full name" name="name" required placeholder="Your name" />
                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  required
                  placeholder="you@email.com"
                />
                <Input label="Phone" type="tel" name="phone" placeholder="(555) 000-0000" />
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="How can we help you today?"
                    className="flex w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-500/20"
                  />
                </div>
                {sent ? (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                    Thank you. Your message has been received.
                  </div>
                ) : (
                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    Submit Inquiry
                  </Button>
                )}
              </div>
            </motion.form>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="grid gap-5 sm:grid-cols-2"
            >
              {contactBlocks.map((block, i) => {
                const Icon = icons[i];
                return (
                  <motion.div
                    key={block.title}
                    variants={staggerItem}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ocean-100 text-ocean-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-serif text-lg font-semibold text-ocean-950">
                      {block.title}
                    </h3>
                    {block.lines.map((line) => (
                      <p key={line} className="mt-1 text-sm text-slate-600">
                        {line}
                      </p>
                    ))}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
