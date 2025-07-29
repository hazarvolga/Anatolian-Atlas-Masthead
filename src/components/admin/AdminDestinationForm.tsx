import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BasicDestinationInfo, { type DestinationFormData } from "./destination-form/BasicDestinationInfo";
import ExtraDestinationFields from "./destination-form/ExtraDestinationFields";
import AIEnrichmentFields from "./destination-form/AIEnrichmentFields";
import DescriptionSection from "./destination-form/DescriptionSection";
import DestinationFormActions from "./destination-form/DestinationFormActions";
import { useAdminDestinationFormLogic } from "./useAdminDestinationFormLogic";

interface AdminDestinationFormProps {
  destination?: any;
  onSuccess?: () => void;
}

export default function AdminDestinationForm({ destination, onSuccess }: AdminDestinationFormProps) {
  const form = useAdminDestinationFormLogic({ destination, onSuccess });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {destination ? "Destinasyonu Düzenle" : "Yeni Destinasyon Oluştur"}
        </CardTitle>
        <CardDescription>
          {destination
            ? "Destinasyon bilgilerini güncelleyin"
            : "Platforma yeni bir destinasyon ekleyin"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(form.onSubmit)} className="space-y-8">
          <BasicDestinationInfo
            register={form.register}
            errors={form.errors}
            setValue={form.setValue}
            watch={form.watch}
            onImageAltText={form.handleGetImageAlt}
            imageHelper={form.imageHelper}
          />

          <ExtraDestinationFields
            register={form.register}
            errors={form.errors}
          />

          <AIEnrichmentFields
            register={form.register}
            setValue={form.setValue}
            watch={form.watch}
            aiEnrichOpen={form.aiEnrichOpen}
            setAIEnrichOpen={form.setAIEnrichOpen}
            onAIEnrich={form.handleAIEnrich}
            onAcceptEnrich={form.handleAcceptEnrich}
            onAcceptAllEnrich={form.handleAcceptAllEnrich}
            aiLoading={form.aiLoading}
            enrichedData={form.enrichedData}
          />

          <DescriptionSection
            register={form.register}
            errors={form.errors}
            aiDescOpen={form.aiDescOpen}
            setAIDescOpen={form.setAIDescOpen}
            onAIGetDesc={form.handleAIGetDesc}
            onAcceptAIDesc={form.handleAcceptAIDesc}
            aiLoading={form.aiLoading}
            aiResult={form.aiResult}
          />

          <DestinationFormActions
            setValue={form.setValue}
            watch={form.watch}
            isSubmitting={form.createDestination.isPending || form.updateDestination.isPending}
            isEdit={!!destination}
          />
        </form>
      </CardContent>
    </Card>
  );
}
