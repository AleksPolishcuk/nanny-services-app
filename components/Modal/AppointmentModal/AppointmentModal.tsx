"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Modal from "@/components/Modal/Modal";
import styles from "./AppointmentModal.module.css";
import { appointmentSchema } from "@/utils/validationSchema";
import { AppointmentValues } from "@/types/nanny";
import { useToast } from "@/components/Toast/ToastProvider";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  nannyName: string;
  nannyAvatarUrl: string;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function buildTimeOptions() {
  const start = 9 * 60;
  const end = 16 * 60;
  const step = 30;

  const out: string[] = [];
  for (let m = start; m <= end; m += step) {
    const hh = Math.floor(m / 60);
    const mm = m % 60;
    out.push(`${pad2(hh)} : ${pad2(mm)}`);
  }
  return out;
}

const TIME_OPTIONS = buildTimeOptions();

export default function AppointmentModal({
  isOpen,
  onClose,
  nannyName,
  nannyAvatarUrl,
}: Props) {
  const { toast } = useToast();

  const form = useForm<AppointmentValues>({
    resolver: yupResolver(appointmentSchema),
    mode: "onSubmit",
    defaultValues: {
      address: "",
      phone: "+380",
      childAge: "",
      time: "", // важливо: не "00:00"
      email: "",
      parentName: "",
      comment: "",
    },
  });

  const [timeOpen, setTimeOpen] = useState(false);
  const timeRootRef = useRef<HTMLDivElement | null>(null);

  const timeValue = form.watch("time");

  useEffect(() => {
    if (!isOpen) return;
    setTimeOpen(false);
  }, [isOpen]);

  useEffect(() => {
    if (!timeOpen) return;

    const onDocClick = (e: MouseEvent) => {
      const el = timeRootRef.current;
      if (!el) return;
      if (!el.contains(e.target as Node)) setTimeOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTimeOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [timeOpen]);

  const handleClose = () => {
    setTimeOpen(false);
    form.reset();
    onClose();
  };

  const setTime = (t: string) => {
    form.setValue("time", t, { shouldValidate: true, shouldDirty: true });
    setTimeOpen(false);
  };

  const onSubmit = async (_values: AppointmentValues) => {
    toast({
      type: "success",
      title: "Sent successfully",
      message: "Your appointment request has been sent.",
    });

    form.reset();
    onClose();
  };

  const timeLabel = useMemo(() => {
    return timeValue ? timeValue : "Meeting time";
  }, [timeValue]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel="Make an appointment"
    >
      <div className={styles.wrap}>
        <button
          type="button"
          className={styles.close}
          onClick={handleClose}
          aria-label="Close modal"
        >
          <svg width="32" height="32" aria-hidden="true">
            <use href="/sprite.svg#icon-x" />
          </svg>
        </button>

        <h2 className={styles.title}>
          Make an appointment <br /> with a babysitter
        </h2>

        <p className={styles.desc}>
          Arranging a meeting with a caregiver for your child is the first step
          to creating a safe and comfortable environment. Fill out the form
          below so we can match you with the perfect care partner.
        </p>

        <div className={styles.nannyRow}>
          <Image
            className={styles.nannyAvatar}
            src={nannyAvatarUrl}
            alt={nannyName}
            width={44}
            height={44}
          />

          <div className={styles.nannyText}>
            <p className={styles.nannyLabel}>Your nanny</p>
            <p className={styles.nannyName}>{nannyName}</p>
          </div>
        </div>

        <form
          className={styles.form}
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <div className={styles.grid2}>
            <div className={styles.field}>
              <input
                className={styles.input}
                placeholder="Address"
                {...form.register("address")}
              />
              {form.formState.errors.address?.message && (
                <p className={styles.error}>
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <input
                className={styles.input}
                placeholder="+380"
                {...form.register("phone")}
              />
              {form.formState.errors.phone?.message && (
                <p className={styles.error}>
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <input
                className={styles.input}
                placeholder="Child's age"
                {...form.register("childAge")}
              />
              {form.formState.errors.childAge?.message && (
                <p className={styles.error}>
                  {form.formState.errors.childAge.message}
                </p>
              )}
            </div>

            <div className={styles.field} ref={timeRootRef}>
              <button
                type="button"
                className={[styles.input, styles.timeBtn].join(" ")}
                onClick={() => setTimeOpen((s) => !s)}
                aria-haspopup="listbox"
                aria-expanded={timeOpen}
              >
                <span className={styles.timeText}>{timeLabel}</span>
                <span className={styles.clock} aria-hidden="true">
                  <svg width="20" height="20">
                    <use href="/sprite.svg#icon-clock" />
                  </svg>
                </span>
              </button>

              {timeOpen && (
                <div
                  className={styles.timeMenu}
                  role="listbox"
                  aria-label="Meeting time"
                >
                  <p className={styles.timeTitle}>Meeting time</p>

                  <ul className={styles.timeList}>
                    {TIME_OPTIONS.map((t) => {
                      const active = t === timeValue;
                      return (
                        <li key={t}>
                          <button
                            type="button"
                            className={[
                              styles.timeItem,
                              active ? styles.timeActive : "",
                            ].join(" ")}
                            onClick={() => setTime(t)}
                            role="option"
                            aria-selected={active}
                          >
                            {t}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {form.formState.errors.time?.message && (
                <p className={styles.error}>
                  {form.formState.errors.time.message}
                </p>
              )}
            </div>
          </div>

          <div className={styles.field}>
            <input
              className={styles.input}
              placeholder="Email"
              type="email"
              {...form.register("email")}
            />
            {form.formState.errors.email?.message && (
              <p className={styles.error}>
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <input
              className={styles.input}
              placeholder="Father's or mother's name"
              {...form.register("parentName")}
            />
            {form.formState.errors.parentName?.message && (
              <p className={styles.error}>
                {form.formState.errors.parentName.message}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <textarea
              className={styles.textarea}
              placeholder="Comment"
              {...form.register("comment")}
            />
            {form.formState.errors.comment?.message && (
              <p className={styles.error}>
                {form.formState.errors.comment.message}
              </p>
            )}
          </div>

          <button
            className={styles.submit}
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Send
          </button>
        </form>
      </div>
    </Modal>
  );
}
