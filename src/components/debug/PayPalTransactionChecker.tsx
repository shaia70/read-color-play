import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TransactionResult {
  success: boolean;
  transaction_id?: string;
  found?: boolean;
  transaction_details?: any;
  summary?: any;
  message?: string;
  error?: string;
}

export const PayPalTransactionChecker = () => {
  const [orderId, setOrderId] = useState('34T3389822652725C');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TransactionResult | null>(null);

  const searchTransaction = async () => {
    if (!orderId.trim()) {
      toast.error('נא להכניס Order ID');
      return;
    }

    setLoading(true);
    try {
      console.log('Searching for transaction:', orderId);
      
      const { data, error } = await supabase.functions.invoke('get-transaction-by-id', {
        body: { transaction_id: orderId }
      });

      if (error) {
        console.error('Function error:', error);
        toast.error(`שגיאה בקריאה לפונקציה: ${error.message}`);
        return;
      }

      console.log('Function result:', data);
      setResult(data);
      
      if (data.success && data.found && data.summary) {
        toast.success('Transaction נמצא בהצלחה!');
      } else if (data.success && !data.found) {
        toast.warning('Transaction לא נמצא');
      } else {
        toast.error(`שגיאה: ${data.error || 'Unknown error'}`);
      }

    } catch (error) {
      console.error('Error calling function:', error);
      toast.error('שגיאה בחיפוש Transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>PayPal Transaction ID Checker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="הכנס Order ID או Transaction ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1"
              dir="ltr"
            />
            <Button 
              onClick={searchTransaction}
              disabled={loading}
            >
              {loading ? 'מחפש...' : 'חפש Transaction'}
            </Button>
          </div>

          {result && (
            <div className="space-y-4">
              <Card className={result.success && result.found ? "border-green-500" : "border-red-500"}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    תוצאות חיפוש
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm font-mono">
                    <div><strong>Success:</strong> {result.success ? 'Yes' : 'No'}</div>
                    <div><strong>Found:</strong> {result.found ? 'Yes' : 'No'}</div>
                    <div><strong>Message:</strong> {result.message}</div>
                    
                    {result.summary && (
                      <div className="mt-4 p-3 bg-green-50 rounded">
                        <h4 className="font-bold mb-2">Transaction Summary:</h4>
                        <div><strong>Transaction ID:</strong> {result.summary.transaction_id}</div>
                        <div><strong>PayPal Reference ID:</strong> {result.summary.paypal_reference_id}</div>
                        <div><strong>Payer Email:</strong> {result.summary.payer_email}</div>
                        <div><strong>Amount:</strong> {JSON.stringify(result.summary.amount)}</div>
                        <div><strong>Status:</strong> {result.summary.status}</div>
                        <div><strong>Date:</strong> {result.summary.date}</div>
                      </div>
                    )}

                    {result.error && (
                      <div className="mt-4 p-3 bg-red-50 rounded text-red-700">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}

                    <details className="mt-4">
                      <summary className="cursor-pointer font-bold">פרטים מלאים (JSON)</summary>
                      <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-96">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </details>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};