package com.venuebit.android.ui.screens.discovery

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import com.venuebit.android.data.local.ServerConfig
import com.venuebit.android.data.models.Event
import com.venuebit.android.ui.theme.VenueBitColors

@Composable
fun EventsHorizontalSection(
    title: String,
    events: List<Event>,
    serverConfig: ServerConfig,
    onEventClick: (Event) -> Unit,
    onSeeAllClick: () -> Unit
) {
    Column {
        // Section header with title and "See All" button
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onBackground
            )

            TextButton(onClick = onSeeAllClick) {
                Text(
                    text = "See All",
                    style = MaterialTheme.typography.labelLarge,
                    color = VenueBitColors.Indigo400
                )
            }
        }

        // Horizontal scrolling events
        LazyRow(
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(events.take(6)) { event ->
                EventCard(
                    event = event,
                    serverConfig = serverConfig,
                    isCompact = true,
                    onClick = { onEventClick(event) }
                )
            }
        }
    }
}

@Composable
fun EventCard(
    event: Event,
    serverConfig: ServerConfig,
    isCompact: Boolean = false,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(200.dp)
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column {
            // Event image
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(if (isCompact) 100.dp else 140.dp)
            ) {
                AsyncImage(
                    model = event.fullImageUrl(serverConfig),
                    contentDescription = event.title,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(if (isCompact) 100.dp else 140.dp)
                        .clip(RoundedCornerShape(topStart = 12.dp, topEnd = 12.dp)),
                    contentScale = ContentScale.Crop
                )

                // Emoji overlay for image placeholder fallback
                if (event.imageUrl.isBlank()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(if (isCompact) 100.dp else 140.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = event.displayEmoji,
                            style = MaterialTheme.typography.displayMedium
                        )
                    }
                }
            }

            // Event info
            Column(
                modifier = Modifier.padding(12.dp)
            ) {
                Text(
                    text = event.title,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = MaterialTheme.colorScheme.onSurface,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = event.venueName,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = event.formattedDate,
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = event.priceRange.minFormatted,
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = VenueBitColors.Indigo400
                )
            }
        }
    }
}
