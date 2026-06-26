"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import spec from "@/app/api/openapi.json"; // Pfad anpassen

export default function DocsPage() {
    return <SwaggerUI spec={spec as any} />;
}
