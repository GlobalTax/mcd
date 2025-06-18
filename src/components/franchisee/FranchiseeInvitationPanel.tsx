
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useFranchiseeInvitations } from '@/hooks/useFranchiseeInvitations';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FranchiseeInvitationPanelProps {
  franchiseeId: string;
  franchiseeEmail?: string;
}

export const FranchiseeInvitationPanel: React.FC<FranchiseeInvitationPanelProps> = ({
  franchiseeId,
  franchiseeEmail
}) => {
  const { invitations, loading, sendInvitation } = useFranchiseeInvitations(franchiseeId);
  const [email, setEmail] = useState(franchiseeEmail || '');
  const [sending, setSending] = useState(false);

  const handleSendInvitation = async () => {
    if (!email.trim()) return;

    setSending(true);
    const success = await sendInvitation(email.trim());
    if (success) {
      setEmail('');
    }
    setSending(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Aceptada</Badge>;
      case 'expired':
        return <Badge variant="outline" className="text-red-600 border-red-600"><XCircle className="w-3 h-3 mr-1" />Expirada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="w-5 h-5 mr-2" />
          Invitaciones al Portal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Email del franquiciado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <Button 
            onClick={handleSendInvitation}
            disabled={!email.trim() || sending}
            className="flex items-center"
          >
            <Send className="w-4 h-4 mr-2" />
            {sending ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Cargando invitaciones...</p>
        ) : invitations.length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Historial de Invitaciones</h4>
            {invitations.map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{invitation.email}</p>
                  <p className="text-xs text-gray-500">
                    Enviada el {format(new Date(invitation.invited_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                  </p>
                  {invitation.expires_at && (
                    <p className="text-xs text-gray-500">
                      Expira el {format(new Date(invitation.expires_at), 'dd/MM/yyyy', { locale: es })}
                    </p>
                  )}
                </div>
                {getStatusBadge(invitation.status)}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No se han enviado invitaciones</p>
        )}
      </CardContent>
    </Card>
  );
};
