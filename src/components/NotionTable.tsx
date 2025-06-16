
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, ChevronDown } from 'lucide-react';

interface TableData {
  id: string;
  subjectLine: string;
  sendSize: number;
  openRate: string;
  unsubscriptionRate: string;
  ctaClickThrough: string;
}

const initialData: TableData[] = [
  {
    id: '1',
    subjectLine: 'Grow with Acme 🚀',
    sendSize: 20000,
    openRate: '34.3%',
    unsubscriptionRate: '0.31%',
    ctaClickThrough: '2.1%'
  },
  {
    id: '2',
    subjectLine: 'Acme tips + tricks',
    sendSize: 20000,
    openRate: '29.4%',
    unsubscriptionRate: '0.26%',
    ctaClickThrough: '1.9%'
  },
  {
    id: '3',
    subjectLine: 'Acme 101 📚',
    sendSize: 20000,
    openRate: '30.7%',
    unsubscriptionRate: '0.22%',
    ctaClickThrough: '2.4%'
  }
];

const definitions = [
  {
    term: 'Send size',
    definition: 'The number of registered users who receive an email send — does not account for undelivered %'
  },
  {
    term: 'Open rate',
    definition: 'Percentage of users who open the email'
  },
  {
    term: 'Unsubscription rate',
    definition: 'Percentage of users who opted-out from the mailing list from the body of an email'
  },
  {
    term: 'CTA click-through',
    definition: 'Percentage of users who clicked on a call-to-action button or link in the email'
  }
];

export function NotionTable() {
  const [data, setData] = useState<TableData[]>(initialData);
  const [showDefinitions, setShowDefinitions] = useState(false);
  const [newRow, setNewRow] = useState({
    subjectLine: '',
    sendSize: '',
    openRate: '',
    unsubscriptionRate: '',
    ctaClickThrough: ''
  });
  const [isAddingRow, setIsAddingRow] = useState(false);

  const handleAddRow = () => {
    if (newRow.subjectLine && newRow.sendSize) {
      const newData: TableData = {
        id: Date.now().toString(),
        subjectLine: newRow.subjectLine,
        sendSize: parseInt(newRow.sendSize),
        openRate: newRow.openRate || '0%',
        unsubscriptionRate: newRow.unsubscriptionRate || '0%',
        ctaClickThrough: newRow.ctaClickThrough || '0%'
      };
      
      setData([...data, newData]);
      setNewRow({
        subjectLine: '',
        sendSize: '',
        openRate: '',
        unsubscriptionRate: '',
        ctaClickThrough: ''
      });
      setIsAddingRow(false);
    }
  };

  const handleCellEdit = (id: string, field: keyof TableData, value: string | number) => {
    setData(data.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
            <span className="text-orange-600 text-sm">📊</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Meeting Notes / Growth team weekly</h1>
        </div>
      </div>

      <div className="space-y-8">
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="px-0 pb-4">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Email send update
            </CardTitle>
          </CardHeader>
          
          <CardContent className="px-0">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">Subject line</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">Send size</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">Open rate</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">Unsubscription rate</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-4 px-6">CTA click-through</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row) => (
                    <TableRow 
                      key={row.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {row.subjectLine.includes('🚀') && <span>🚀</span>}
                          {row.subjectLine.includes('📚') && <span>📚</span>}
                          <span className="font-medium text-gray-900">
                            {row.subjectLine.replace(/🚀|📚/g, '').trim()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-700">
                        {row.sendSize.toLocaleString()}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-700">
                        {row.openRate}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-700">
                        {row.unsubscriptionRate}
                      </TableCell>
                      <TableCell className="py-4 px-6 text-gray-700">
                        {row.ctaClickThrough}
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {isAddingRow && (
                    <TableRow className="border-b border-gray-100">
                      <TableCell className="py-4 px-6">
                        <Input
                          value={newRow.subjectLine}
                          onChange={(e) => setNewRow({...newRow, subjectLine: e.target.value})}
                          placeholder="Subject line"
                          className="border-0 p-0 h-auto focus-visible:ring-0"
                        />
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Input
                          type="number"
                          value={newRow.sendSize}
                          onChange={(e) => setNewRow({...newRow, sendSize: e.target.value})}
                          placeholder="0"
                          className="border-0 p-0 h-auto focus-visible:ring-0"
                        />
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Input
                          value={newRow.openRate}
                          onChange={(e) => setNewRow({...newRow, openRate: e.target.value})}
                          placeholder="0%"
                          className="border-0 p-0 h-auto focus-visible:ring-0"
                        />
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Input
                          value={newRow.unsubscriptionRate}
                          onChange={(e) => setNewRow({...newRow, unsubscriptionRate: e.target.value})}
                          placeholder="0%"
                          className="border-0 p-0 h-auto focus-visible:ring-0"
                        />
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Input
                          value={newRow.ctaClickThrough}
                          onChange={(e) => setNewRow({...newRow, ctaClickThrough: e.target.value})}
                          placeholder="0%"
                          className="border-0 p-0 h-auto focus-visible:ring-0"
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              <div className="p-4 border-t border-gray-100">
                {!isAddingRow ? (
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsAddingRow(true)}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add row
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleAddRow} size="sm">
                      Save
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setIsAddingRow(false)}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 -m-2 p-2 rounded"
            onClick={() => setShowDefinitions(!showDefinitions)}
          >
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDefinitions ? 'rotate-0' : '-rotate-90'}`} />
            <h3 className="text-lg font-semibold text-gray-900">A quick note on data definitions</h3>
          </div>
          
          {showDefinitions && (
            <div className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700 py-3 w-48">Term</TableHead>
                    <TableHead className="font-semibold text-gray-700 py-3">Definition</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {definitions.map((def, index) => (
                    <TableRow key={index} className="border-b border-gray-100">
                      <TableCell className="py-4 font-medium text-gray-900">
                        {def.term}
                      </TableCell>
                      <TableCell className="py-4 text-gray-700">
                        {def.definition}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
