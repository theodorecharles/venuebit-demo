package com.venuebit.android.data.local

import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Manages the badge state for the tickets tab.
 * Shows a badge when new tickets have been purchased but not yet viewed.
 */
@Singleton
class TicketBadgeManager @Inject constructor() {

    private val _hasNewTickets = MutableStateFlow(false)
    val hasNewTickets: StateFlow<Boolean> = _hasNewTickets.asStateFlow()

    private val _newTicketsCount = MutableStateFlow(0)
    val newTicketsCount: StateFlow<Int> = _newTicketsCount.asStateFlow()

    /**
     * Called when a purchase is completed to show the badge.
     */
    fun onPurchaseComplete(ticketCount: Int = 1) {
        _newTicketsCount.value += ticketCount
        _hasNewTickets.value = true
    }

    /**
     * Called when the user views the tickets tab to clear the badge.
     */
    fun clearBadge() {
        _hasNewTickets.value = false
        _newTicketsCount.value = 0
    }
}
