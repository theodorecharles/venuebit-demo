package com.venuebit.android.services

import com.venuebit.android.data.models.Ticket
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AppState @Inject constructor() {
    private val _purchasedTickets = MutableStateFlow<List<Ticket>>(emptyList())
    val purchasedTickets: StateFlow<List<Ticket>> = _purchasedTickets.asStateFlow()

    fun addPurchasedTickets(tickets: List<Ticket>) {
        _purchasedTickets.value = _purchasedTickets.value + tickets
    }

    fun clearPurchasedTickets() {
        _purchasedTickets.value = emptyList()
    }
}
