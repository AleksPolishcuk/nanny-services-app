"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import styles from "./NannyCard.module.css";
import type { Nanny } from "@/types/nanny";
import AppointmentModal from "@/components/AppointmentModal/AppointmentModal";

type Props = {
  nanny: Nanny;
};

function getAge(birthdayISO: string) {
  const d = new Date(birthdayISO);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}

export default function NannyCard({ nanny }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [apptOpen, setApptOpen] = useState(false);

  const age = useMemo(() => getAge(nanny.birthday), [nanny.birthday]);

  return (
    <article className={styles.card}>
      <div className={styles.left}>
        <div className={styles.avatarFrame}>
          <Image
            className={styles.avatar}
            src={nanny.avatar_url}
            alt={nanny.name}
            width={96}
            height={96}
            priority={false}
          />
          <span className={styles.onlineDot} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.headRow}>
          <div className={styles.titleBox}>
            <p className={styles.smallLabel}>Nanny</p>
            <h3 className={styles.name}>{nanny.name}</h3>
          </div>

          <div className={styles.meta}>
            <span className={styles.metaItem}>
              <svg
                className={styles.metaIcon}
                width="16"
                height="16"
                aria-hidden="true"
              >
                <use href="/sprite.svg#icon-Location" />
              </svg>
              {nanny.location}
            </span>

            <span className={styles.sep} aria-hidden="true" />

            <span className={styles.metaItem}>
              <svg
                className={styles.starIcon}
                width="16"
                height="16"
                aria-hidden="true"
              >
                <use href="/sprite.svg#icon-star" />
              </svg>
              Rating:{" "}
              <strong className={styles.metaStrong}>{nanny.rating}</strong>
            </span>

            <span className={styles.sep} aria-hidden="true" />

            <span className={styles.metaItem}>
              Price / 1 hour:{" "}
              <strong className={styles.price}>{nanny.price_per_hour}$</strong>
            </span>

            <button
              type="button"
              className={styles.heartBtn}
              onClick={() => setIsFav((s) => !s)}
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              <svg width="26" height="26" aria-hidden="true">
                <use
                  href={`/sprite.svg#${
                    isFav
                      ? "icon-Property-heartActive"
                      : "icon-Property-heart1Default"
                  }`}
                />
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.chips}>
          <span className={styles.chip}>
            Age: <strong className={styles.chipStrong}>{age}</strong>
          </span>

          <span className={styles.chip}>
            Experience:{" "}
            <strong className={styles.chipStrong}>{nanny.experience}</strong>
          </span>

          <span className={styles.chip}>
            Kids Age:{" "}
            <strong className={styles.chipStrong}>{nanny.kids_age}</strong>
          </span>

          <span className={styles.chip}>
            Characters:{" "}
            <strong className={styles.chipStrong}>
              {nanny.characters.join(", ")}
            </strong>
          </span>

          <span className={styles.chip}>
            Education:{" "}
            <strong className={styles.chipStrong}>{nanny.education}</strong>
          </span>
        </div>

        <p className={styles.about}>
          {expanded
            ? nanny.about
            : `${nanny.about.slice(0, 150)}${
                nanny.about.length > 150 ? "…" : ""
              }`}
        </p>

        <button
          type="button"
          className={styles.readMore}
          onClick={() => setExpanded((s) => !s)}
        >
          {expanded ? "Show less" : "Read more"}
        </button>

        {expanded && (
          <>
            <div className={styles.reviews}>
              {nanny.reviews.map((r) => (
                <div
                  key={`${r.reviewer}-${r.comment}`}
                  className={styles.reviewItem}
                >
                  <div className={styles.reviewAvatar} aria-hidden="true">
                    {r.reviewer.slice(0, 1).toUpperCase()}
                  </div>

                  <div className={styles.reviewBody}>
                    <p className={styles.reviewName}>{r.reviewer}</p>
                    <p className={styles.reviewRating}>
                      <svg width="16" height="16" aria-hidden="true">
                        <use href="/sprite.svg#icon-star" />
                      </svg>
                      <span>{r.rating}</span>
                    </p>
                    <p className={styles.reviewText}>{r.comment}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={styles.appointmentBtn}
              onClick={() => setApptOpen(true)}
            >
              Make an appointment
            </button>

            <AppointmentModal
              isOpen={apptOpen}
              onClose={() => setApptOpen(false)}
              nannyName={nanny.name}
              nannyAvatarUrl={nanny.avatar_url}
            />
          </>
        )}
      </div>
    </article>
  );
}
