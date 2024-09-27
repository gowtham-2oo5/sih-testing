"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const applicationTypes = [
  { value: "new", label: "New Institution" },
  { value: "existing", label: "Existing Institution" },
  { value: "closure", label: "Institution Closure" },
];

const documentTypes = {
  new: [
    "Registration Certificate",
    "Land Documents",
    "Building Plan",
    "Faculty List",
  ],
  existing: [
    "Annual Report",
    "Compliance Certificate",
    "Student Enrollment Data",
  ],
  closure: [
    "No Objection Certificate",
    "Student Transfer Plan",
    "Asset Disposal Plan",
  ],
};

export default function ApplicationForm() {
  const [applicationType, setApplicationType] = useState("");
  const [documents, setDocuments] = useState<{ [key: string]: File | null }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFileChange = (documentType: string, file: File | null) => {
    setDocuments((prev) => ({ ...prev, [documentType]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const allDocumentsUploaded =
    applicationType &&
    documentTypes[applicationType as keyof typeof documentTypes].every(
      (docType) => documents[docType]
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">AICTE Application Form</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="application-type">Application Type</Label>
          <Select onValueChange={setApplicationType}>
            <SelectTrigger id="application-type">
              <SelectValue placeholder="Select application type" />
            </SelectTrigger>
            <SelectContent>
              {applicationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AnimatePresence>
          {applicationType && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-semibold">Required Documents</h2>
              {documentTypes[applicationType as keyof typeof documentTypes].map(
                (docType) => (
                  <div key={docType} className="flex items-center space-x-4">
                    <Label htmlFor={docType} className="w-1/3">
                      {docType}
                    </Label>
                    <Input
                      id={docType}
                      type="file"
                      onChange={(e) =>
                        handleFileChange(docType, e.target.files?.[0] || null)
                      }
                      className="w-2/3"
                    />
                    {documents[docType] && (
                      <CheckCircle className="text-green-500" />
                    )}
                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {allDocumentsUploaded && !isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-center"
            >
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center"
            role="alert"
          >
            <strong className="font-bold">Application Submitted!</strong>
            <p className="block sm:inline">
              Our AI model is currently reviewing your application.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
