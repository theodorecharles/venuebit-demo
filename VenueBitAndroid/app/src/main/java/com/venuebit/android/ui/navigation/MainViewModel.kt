package com.venuebit.android.ui.navigation

import androidx.lifecycle.ViewModel
import com.venuebit.android.data.local.TicketBadgeManager
import dagger.hilt.android.lifecycle.HiltViewModel
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    val ticketBadgeManager: TicketBadgeManager
) : ViewModel()
