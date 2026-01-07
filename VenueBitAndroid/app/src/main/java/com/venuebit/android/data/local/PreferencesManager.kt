package com.venuebit.android.data.local

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore

// Extension property to create a DataStore instance using the preferencesDataStore delegate
// Note: The actual provider is in AppModule.kt - this is just for the extension definition
val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "venuebit_preferences")
