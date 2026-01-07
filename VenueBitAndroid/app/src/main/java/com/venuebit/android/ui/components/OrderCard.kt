package com.venuebit.android.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Divider
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.venuebit.android.data.models.Order
import com.venuebit.android.ui.theme.LocalVenueBitColors

@Composable
fun OrderCard(
    order: Order,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current
    val tickets = order.tickets

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = colors.surface
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            // Order header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Order #${order.id.takeLast(8)}",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = colors.textPrimary
                    )

                    Text(
                        text = order.formattedDate,
                        fontSize = 12.sp,
                        color = colors.textSecondary,
                        modifier = Modifier.padding(top = 2.dp)
                    )
                }

                StatusBadge(status = order.status)
            }

            // Divider
            Divider(
                modifier = Modifier.padding(vertical = 12.dp),
                color = colors.border
            )

            // List of tickets
            tickets.forEach { ticket ->
                TicketRow(
                    ticket = ticket,
                    modifier = Modifier.padding(vertical = 4.dp)
                )
            }

            // Footer
            Divider(
                modifier = Modifier.padding(vertical = 12.dp),
                color = colors.border
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "${tickets.size} ticket${if (tickets.size != 1) "s" else ""}",
                    fontSize = 12.sp,
                    color = colors.textSecondary
                )

                Text(
                    text = "Total: $${String.format("%.2f", order.total)}",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = colors.textPrimary
                )
            }
        }
    }
}
