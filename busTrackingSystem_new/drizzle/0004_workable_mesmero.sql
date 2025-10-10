ALTER TABLE "routetable" ALTER COLUMN "latitude" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "routetable" ALTER COLUMN "latitude" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "routetable" ADD COLUMN "longitude" double precision NOT NULL;--> statement-breakpoint
ALTER TABLE "routetable" DROP COLUMN "logitude";