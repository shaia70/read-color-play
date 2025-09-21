import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const PayPalUpdater = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const updatePayPalInfo = async () => {
    setLoading(true);
    try {
      console.log('Calling update-payment-from-paypal...');
      
      const { data, error } = await supabase.functions.invoke('update-payment-from-paypal', {
        body: { transaction_id: '5XE03844WW957952U' }
      });

      if (error) {
        console.error('Function error:', error);
        toast.error(`שגיאה: ${error.message}`);
        return;
      }

      console.log('PayPal update result:', data);
      setResult(data);
      
      if (data.success) {
        toast.success('PayPal מידע עודכן בהצלחה!');
      } else {
        toast.error(`שגיאה: ${data.error}`);
      }

    } catch (error) {
      console.error('Error calling function:', error);
      toast.error('שגיאה בעדכון PayPal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>PayPal Session ID Updater</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="mb-4 p-3 bg-blue-50 rounded">
            <h3 className="font-bold text-blue-700">עדכון Session ID עבור shaikey</h3>
            <p className="text-sm text-blue-600">Transaction ID: 5XE03844WW957952U</p>
          </div>
          
          <Button 
            onClick={updatePayPalInfo}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'מעדכן מ-PayPal API...' : 'עדכן Session ID מ-PayPal'}
          </Button>

          {result && (
            <div className="space-y-4">
              <Card className={result.success ? "border-green-500" : "border-red-500"}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    תוצאות עדכון PayPal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><strong>הצלחה:</strong> {result.success ? 'כן' : 'לא'}</div>
                    
                    {result.success && (
                      <>
                        <div><strong>Session ID:</strong> {result.session_id}</div>
                        <div><strong>Transaction ID:</strong> {result.transaction_id}</div>
                        <div><strong>PayPal Status:</strong> {result.paypal_status}</div>
                        <div><strong>Payer Email:</strong> {result.payer_email}</div>
                        <div><strong>Payer ID:</strong> {result.payer_id}</div>
                        <div><strong>Amount:</strong> {result.amount}</div>
                        <div><strong>Payment Updated:</strong> {result.payment_updated ? 'כן' : 'לא'}</div>
                      </>
                    )}

                    {result.error && (
                      <div className="mt-4 p-3 bg-red-50 rounded text-red-700">
                        <strong>שגיאה:</strong> {result.error}
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