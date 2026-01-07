package com.venuebit.android.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.QrCode2
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.venuebit.android.data.models.Ticket
import com.venuebit.android.ui.theme.LocalVenueBitColors

@Composable
fun TicketRow(
    ticket: Ticket,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Icon(
            imageVector = Icons.Default.QrCode2,
            contentDescription = "Ticket",
            tint = colors.primary,
            modifier = Modifier.size(40.dp)
        )

        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = ticket.eventTitle,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = colors.textPrimary
            )

            Text(
                text = "Section ${ticket.section} | Row ${ticket.row} | Seat ${ticket.seatNumber}",
                fontSize = 12.sp,
                color = colors.textSecondary
            )
        }

        Text(
            text = "$${String.format("%.2f", ticket.price)}",
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = colors.textPrimary
        )
    }
}
