import { ObjectId } from "bson";
import { z } from "zod";

export const templateTypes = z
  .union([z.literal("NZ-GST"), z.literal("AU-GST"), z.literal("AU-GST2"), z.literal("ARAMEX")])
  .optional()
  .nullable();

export const settingsResult = z
  .object({
    gstNumber: z.string().optional().nullable(),
    email: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    website: z.string().optional().nullable(),
    note: z.string().optional().nullable(),
    paymentInstructions: z.string().optional().nullable(),
    addr1: z.string().optional().nullable(),
    addr2: z.string().optional().nullable(),
    suburb: z.string().optional().nullable(),
    province: z.string().optional().nullable(),
    zip: z.string().optional().nullable(),
    country: z.string().optional().nullable(),
    logo: z.string().optional().nullable(),
    templateType: templateTypes,
  })
  .optional()
  .nullable();

export type Settings = z.infer<typeof settingsResult>;

export const ShopifyConnectionResult = z
  .object({
    apiKey: z.string(),
    domain: z.string(),
    scopes: z
      .string()
      .nullable()
      .optional()
      .describe("The scopes approved (comma separated string)"),
    tokenMode: z
      .union([z.literal("NON_EXPIRING_OFFLINE"), z.literal("EXPIRING_OFFLINE")])
      .optional()
      .nullable(),
    accessTokenExpiresAt: z.date().optional().nullable(),
    refreshToken: z.string().optional().nullable(),
    refreshTokenExpiresAt: z.date().optional().nullable(),
    tokenGeneration: z.number().int().nonnegative().optional().nullable(),
    refreshLeaseId: z.string().optional().nullable(),
    refreshLeaseExpiresAt: z.date().optional().nullable(),
    lastRefreshedAt: z.date().optional().nullable(),
    reauthorizationRequiredAt: z.date().optional().nullable(),
    reauthorizationReason: z.string().optional().nullable(),
  })
  .optional()
  .nullable();

export type ShopifyConnection = z.infer<typeof ShopifyConnectionResult>;

export const ShopifyStatusResult = z
  .union([z.literal("ACTIVE"), z.literal("PENDING"), z.literal("INACTIVE"), z.literal("ERROR")])
  .optional()
  .nullable();

export const OrganisationResult = z.object({
  _id: z.instanceof(ObjectId),
  country: z.string().optional().nullable().describe("country of origin"),
  locale: z.string().optional().nullable().describe("shop locale / language"),
  reviewed: z
    .boolean()
    .optional()
    .nullable()
    .describe("whether or not store has engaged with review element"),
  rating: z.number().optional().nullable().describe("rating score"),
  plan: z.string().optional().nullable().describe("shopify plan"),
  website: z.string().optional().nullable().describe("website URL"),
  createdAt: z.date().nullable().optional(),
  settingsLastSynced: z.date().nullable().optional(),
  uninstalledAt: z.date().nullable().optional(),
  settings: settingsResult,
  shopifyConnection: ShopifyConnectionResult,
  shopifyConnectionStatus: ShopifyStatusResult,
  // Billing stuff
  billingPlanStatus: z
    .union([z.literal("INACTIVE"), z.literal("ACTIVE")])
    .optional()
    .nullable(),
  billingSubscriptionId: z.string().optional().nullable(),
  billingPlanHandle: z.string().optional().nullable(),
  billingUpdatedAt: z.date().nullable().optional(),
});

export type OrganisationResultEntity = z.infer<typeof OrganisationResult>;

export const OrganisationModelSchema = z.object({
  id: z.string(),
  country: OrganisationResult.shape.country,
  locale: OrganisationResult.shape.locale,
  reviewed: OrganisationResult.shape.reviewed,
  rating: OrganisationResult.shape.rating,
  plan: OrganisationResult.shape.plan,
  website: OrganisationResult.shape.website,
  settings: OrganisationResult.shape.settings,
  shopifyConnection: OrganisationResult.shape.shopifyConnection,
  shopifyConnectionStatus: OrganisationResult.shape.shopifyConnectionStatus,
  createdAt: OrganisationResult.shape.createdAt,
  settingsLastSynced: OrganisationResult.shape.settingsLastSynced,
  uninstalledAt: OrganisationResult.shape.uninstalledAt,
  shopifySite: z.string().nullable().optional(),
  billingPlanStatus: OrganisationResult.shape.billingPlanStatus,
  billingSubscriptionId: OrganisationResult.shape.billingSubscriptionId,
  billingPlanHandle: OrganisationResult.shape.billingPlanHandle,
  billingUpdatedAt: OrganisationResult.shape.billingUpdatedAt,
});

export type OrganisationModel = z.infer<typeof OrganisationModelSchema>;

export const OrganisationModel = {
  convertFromEntity(
    entity: OrganisationResultEntity,
    includeCredentials = false,
  ): OrganisationModel {
    if (includeCredentials) {
      console.log("includeCredentials IS TRUE");
    }

    const obj: OrganisationModel = {
      id: entity._id.toHexString(),
      country: entity.country || null,
      locale: entity.locale || null,
      reviewed: entity.reviewed || null,
      rating: entity.rating || null,
      plan: entity.plan || null,
      website: entity.website || null,
      settings: entity.settings || null,
      createdAt: new Date(entity.createdAt || new Date()),
      settingsLastSynced: entity.settingsLastSynced ? new Date(entity.settingsLastSynced) : null,
      uninstalledAt: entity.uninstalledAt ? new Date(entity.uninstalledAt) : null,
      shopifyConnection: includeCredentials ? entity.shopifyConnection || null : null,
      shopifyConnectionStatus: entity.shopifyConnectionStatus || "INACTIVE",
      shopifySite: entity?.shopifyConnection?.domain || null,
      billingPlanStatus: entity.billingPlanStatus || "INACTIVE",
      billingSubscriptionId: entity.billingSubscriptionId || null,
      billingPlanHandle: entity.billingPlanHandle || null,
      billingUpdatedAt: entity.billingUpdatedAt ? new Date(entity.billingUpdatedAt) : null,
    };
    return OrganisationModelSchema.parse(obj);
  },
};
