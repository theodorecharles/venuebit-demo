package com.venuebit.android.ui.screens.tickets

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.venuebit.android.data.local.UserIdentityManager
import com.venuebit.android.data.models.Order
import com.venuebit.android.data.models.Ticket
import com.venuebit.android.data.repository.OrderRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MyTicketsViewModel @Inject constructor(
    private val orderRepository: OrderRepository,
    private val userIdentityManager: UserIdentityManager
) : ViewModel() {

    companion object {
        private const val TAG = "VenueBit.MyTickets"
    }

    private val _recentPurchases = MutableStateFlow<List<Ticket>>(emptyList())
    val recentPurchases: StateFlow<List<Ticket>> = _recentPurchases.asStateFlow()

    private val _orders = MutableStateFlow<List<Order>>(emptyList())
    val orders: StateFlow<List<Order>> = _orders.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    init {
        loadOrders()
    }

    fun loadOrders() {
        viewModelScope.launch {
            _isLoading.value = true
            try {
                val userId = userIdentityManager.getUserId()
                Log.d(TAG, "Loading orders for userId: $userId")
                val result = orderRepository.getUserOrders(userId)
                result.onSuccess { orderList ->
                    Log.d(TAG, "Loaded ${orderList.size} orders")
                    _orders.value = orderList
                }
                result.onFailure { error ->
                    Log.e(TAG, "Failed to load orders: ${error.message}")
                }
            } catch (e: Exception) {
                Log.e(TAG, "Exception loading orders: ${e.message}")
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun addPurchase(tickets: List<Ticket>) {
        _recentPurchases.value = _recentPurchases.value + tickets
    }

    fun removePurchase(ticket: Ticket) {
        _recentPurchases.value = _recentPurchases.value.filter { it.id != ticket.id }
    }

    fun clearAllPurchases() {
        _recentPurchases.value = emptyList()
    }
}
