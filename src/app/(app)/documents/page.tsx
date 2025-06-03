
"use client";

import { useState, useEffect } from 'react';
import { mockDocuments, mockCases } from '@/lib/mockData';
import type { Document } from '@/types';
import DocumentListItem from '@/components/documents/DocumentListItem';
import SignDocumentDialog from '@/components/documents/SignDocumentDialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [documentToSign, setDocumentToSign] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('all');

  const handleSignDocument = (doc: Document) => {
    setDocumentToSign(doc);
  };

  const handleDocumentSigned = (signedDocumentId: string) => {
    setDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.id === signedDocumentId ? { ...doc, status: "Signed" } : doc
      )
    );
    setDocumentToSign(null);
  };

  const filteredDocuments = documents
    .filter(doc => 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.caseId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(doc => selectedCaseId === 'all' || doc.caseId === selectedCaseId);

  const awaitingSignatureDocs = filteredDocuments.filter(d => d.status === "Awaiting Signature");
  const signedDocs = filteredDocuments.filter(d => d.status === "Signed");
  const otherDocs = filteredDocuments.filter(d => d.status !== "Awaiting Signature" && d.status !== "Signed");


  return (
    <div className="container mx-auto py-2">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-headline font-semibold text-primary">Documentos y Firma Electrónica</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:w-[300px] font-body"
            />
          </div>
          <Select value={selectedCaseId} onValueChange={setSelectedCaseId}>
            <SelectTrigger className="w-full md:w-[180px] font-body">
              <SelectValue placeholder="Filtrar por Caso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Casos</SelectItem>
              {mockCases.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.caseNumber}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
          <TabsTrigger value="all" className="font-body">Todos ({filteredDocuments.length})</TabsTrigger>
          <TabsTrigger value="awaiting" className="font-body">Pendientes de Firma ({awaitingSignatureDocs.length})</TabsTrigger>
          <TabsTrigger value="signed" className="font-body">Firmados ({signedDocs.length})</TabsTrigger>
          <TabsTrigger value="other" className="font-body">Otros ({otherDocs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <DocumentListItem key={doc.id} document={doc} onSign={handleSignDocument} />
              ))}
            </div>
          ) : (
            <p className="font-body text-muted-foreground text-center py-8">No se encontraron documentos que coincidan con tus criterios.</p>
          )}
        </TabsContent>
         <TabsContent value="awaiting">
          {awaitingSignatureDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {awaitingSignatureDocs.map((doc) => (
                <DocumentListItem key={doc.id} document={doc} onSign={handleSignDocument} />
              ))}
            </div>
          ) : (
            <p className="font-body text-muted-foreground text-center py-8">No hay documentos pendientes de firma.</p>
          )}
        </TabsContent>
         <TabsContent value="signed">
          {signedDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {signedDocs.map((doc) => (
                <DocumentListItem key={doc.id} document={doc} onSign={handleSignDocument} />
              ))}
            </div>
          ) : (
            <p className="font-body text-muted-foreground text-center py-8">No se encontraron documentos firmados.</p>
          )}
        </TabsContent>
         <TabsContent value="other">
          {otherDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherDocs.map((doc) => (
                <DocumentListItem key={doc.id} document={doc} onSign={handleSignDocument} />
              ))}
            </div>
          ) : (
            <p className="font-body text-muted-foreground text-center py-8">No se encontraron otros documentos.</p>
          )}
        </TabsContent>
      </Tabs>


      <SignDocumentDialog
        documentToSign={documentToSign}
        onClose={() => setDocumentToSign(null)}
        onDocumentSigned={handleDocumentSigned}
      />
    </div>
  );
}
