package com.venuebit.android.ui.screens.search

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.SubcomposeAsyncImage
import com.venuebit.android.data.local.ServerConfig
import com.venuebit.android.data.models.Event
import com.venuebit.android.ui.theme.LocalVenueBitColors

/**
 * Search result card component displaying event information in a horizontal layout.
 * Shows event image (or emoji fallback), category badge, title, date/venue, and price.
 *
 * @param event The event to display
 * @param serverConfig Server configuration for building image URLs
 * @param onClick Callback when the card is clicked
 * @param modifier Modifier for the card
 */
@Composable
fun SearchResultCard(
    event: Event,
    serverConfig: ServerConfig,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current

    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = colors.surface
        ),
        elevation = CardDefaults.cardElevation(
            defaultElevation = 2.dp
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Left: Event image (80x80)
            EventImageBox(
                event = event,
                serverConfig = serverConfig,
                modifier = Modifier.size(80.dp)
            )

            Spacer(modifier = Modifier.width(12.dp))

            // Right: Event details
            Column(
                modifier = Modifier.weight(1f)
            ) {
                // Category badge
                CategoryBadge(
                    emoji = event.displayEmoji,
                    name = event.category.displayName
                )

                Spacer(modifier = Modifier.height(4.dp))

                // Title (max 2 lines)
                Text(
                    text = event.title,
                    color = colors.textPrimary,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(4.dp))

                // Date and venue
                Text(
                    text = "${event.formattedDate} - ${event.venueName}",
                    color = colors.textSecondary,
                    fontSize = 12.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(4.dp))

                // Price
                Text(
                    text = event.priceRange.minFormatted,
                    color = colors.primaryLight,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

/**
 * Image box component for the search result card.
 * Displays the event image with loading indicator, or emoji fallback on error/missing image.
 */
@Composable
private fun EventImageBox(
    event: Event,
    serverConfig: ServerConfig,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current
    val imageUrl = event.fullImageUrl(serverConfig)

    Card(
        modifier = modifier,
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(
            containerColor = colors.surfaceSecondary
        )
    ) {
        SubcomposeAsyncImage(
            model = imageUrl,
            contentDescription = event.title,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize(),
            loading = {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(colors.surfaceSecondary),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(
                        color = colors.textSecondary,
                        modifier = Modifier.size(20.dp),
                        strokeWidth = 2.dp
                    )
                }
            },
            error = {
                EventFallbackImage(
                    emoji = event.displayEmoji,
                    modifier = Modifier.fillMaxSize()
                )
            }
        )
    }
}

/**
 * Fallback image when event image is unavailable.
 * Displays the event category emoji centered on a secondary surface.
 */
@Composable
private fun EventFallbackImage(
    emoji: String,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current

    Box(
        modifier = modifier.background(colors.surfaceSecondary),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = emoji,
            fontSize = 32.sp
        )
    }
}

/**
 * Small category badge showing emoji and category name.
 */
@Composable
private fun CategoryBadge(
    emoji: String,
    name: String,
    modifier: Modifier = Modifier
) {
    val colors = LocalVenueBitColors.current

    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(4.dp),
        color = colors.surfaceSecondary
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = emoji,
                fontSize = 10.sp
            )
            Spacer(modifier = Modifier.width(3.dp))
            Text(
                text = name,
                color = colors.textSecondary,
                fontSize = 10.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}
