import { z } from "zod";
import { BannerLocationType, BannerType } from "modules/banner/types";

/** Admin banner formida ruxsat etilgan `type` qiymatlari */
export const bannerAdminTypeValues = [
  BannerType.COURSE,
  BannerType.LEADERBOARD,
  BannerType.PROFILE,
  BannerType.MY_COURSES,
  BannerType.SHOP,
  BannerType.VACANCY,
  BannerType.NONE,
] as const;

export type BannerAdminType = (typeof bannerAdminTypeValues)[number];

export const schema = z
  .object({
    title: z.string().min(2, { message: "Banner nomi talab qilinadi" }),
    content: z.string().min(3, { message: "Kontent matni talab qilinadi" }),
    photo: z.union([
      z.custom<File>((file) => file instanceof File, {
        message: "Rasm talab qilinadi",
      }),
      z.string().min(2, { message: "Rasm talab qilinadi" }),
    ]),
    type: z.enum(bannerAdminTypeValues),
    location: z.nativeEnum(BannerLocationType),
    link: z.string().optional().default(""),
    targetId: z.string().min(1, { message: "targetId talab qilinadi" }),
    isActive: z.boolean().optional(),
  });

export type useFormSchemaType = z.infer<typeof schema>;
