export async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<boolean> {
  try {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    console.log(`[WhatsApp] Message link: ${whatsappUrl}`);
    return true;
  } catch (error) {
    console.error("[WhatsApp] Failed to send message:", error);
    return false;
  }
}

export function generateDailyReportMessage(
  date: string,
  totalRevenue: number,
  totalExpense: number,
  netDaily: number
): string {
  return `📊 *تقرير جرد حلويات الشيخ اليومي*

📅 التاريخ: ${date}

💰 *الإيرادات:* ${totalRevenue.toFixed(2)} ريال
💸 *المصاريف:* ${totalExpense.toFixed(2)} ريال
📈 *الصافي:* ${netDaily.toFixed(2)} ريال

تم إنشاء التقرير بواسطة نظام الإدارة المالية`;
}
