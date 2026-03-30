import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  const body = await req.json()

  const {
    id,
    verification_status,
    rejection_reason,
    rejected_documents,
    admin_notes,
    notification_message,
    notified
  } = body

  if (!id || !verification_status) {
    return NextResponse.json(
      { error: 'id and verification_status are required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from('wholesalers')
    .update({
      verification_status,
      rejection_reason: rejection_reason ?? null,
      rejected_documents: rejected_documents ?? [],
      admin_notes: admin_notes ?? null,
      notification_message: notification_message ?? null,
      notified: notified ?? false
    })
    .eq('id', id)
    .select()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ data })
}
