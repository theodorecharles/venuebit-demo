package com.venuebit.android.di

import com.venuebit.android.data.api.CartApi
import com.venuebit.android.data.api.EventsApi
import com.venuebit.android.data.api.FeaturesApi
import com.venuebit.android.data.api.OrdersApi
import com.venuebit.android.data.local.ServerConfig
import com.venuebit.android.data.repository.CartRepository
import com.venuebit.android.data.repository.EventRepository
import com.venuebit.android.data.repository.FeatureRepository
import com.venuebit.android.data.repository.OrderRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object RepositoryModule {

    @Provides
    @Singleton
    fun provideEventRepository(
        eventsApi: EventsApi,
        serverConfig: ServerConfig
    ): EventRepository {
        return EventRepository(eventsApi, serverConfig)
    }

    @Provides
    @Singleton
    fun provideOrderRepository(
        ordersApi: OrdersApi
    ): OrderRepository {
        return OrderRepository(ordersApi)
    }

    @Provides
    @Singleton
    fun provideCartRepository(
        cartApi: CartApi
    ): CartRepository {
        return CartRepository(cartApi)
    }

    @Provides
    @Singleton
    fun provideFeatureRepository(
        featuresApi: FeaturesApi
    ): FeatureRepository {
        return FeatureRepository(featuresApi)
    }
}
