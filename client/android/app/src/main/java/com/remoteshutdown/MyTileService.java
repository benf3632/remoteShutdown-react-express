package com.remoteshutdown;

import android.os.Build;
import android.service.quicksettings.Tile;
import android.service.quicksettings.TileService;
import android.widget.Toast;

import androidx.annotation.RequiresApi;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@RequiresApi(api = Build.VERSION_CODES.N)
public class MyTileService extends TileService {
    public static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    @RequiresApi(api = Build.VERSION_CODES.N)
    @Override
    public void onClick() {
        super.onClick();
        try {
            JSONObject conf;
            conf = readFromConfiguration();
            Tile tile = getQsTile();
            String ipAddress = conf.getString("ipAddress");
            if (tile.getState() == Tile.STATE_INACTIVE) {
                String dataJson = conf.getString("data");
                int responseCode = startTimer(ipAddress, dataJson);
                if (responseCode == 200) {
                    Toast.makeText(getApplicationContext(), "Started Timer on: " + ipAddress + ", " + dataJson, Toast.LENGTH_LONG).show();
                    tile.setState(Tile.STATE_ACTIVE);
                } else {
                    Toast.makeText(getApplicationContext(), "Couldn't Start Timer on: " + ipAddress, Toast.LENGTH_LONG).show();
                }
            } else if (tile.getState() == Tile.STATE_ACTIVE) {
                int responseCode =  stopTimer(ipAddress);
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    Toast.makeText(getApplicationContext(), "Stopped Timer on: " + ipAddress, Toast.LENGTH_LONG).show();
                    tile.setState(Tile.STATE_INACTIVE);
                } else {
                    Toast.makeText(getApplicationContext(), "Couldn't Stop Timer on: " + ipAddress, Toast.LENGTH_LONG).show();
                }
            }
            tile.updateTile();
        } catch (JSONException e) {
            e.printStackTrace();
            Toast.makeText(getApplicationContext(), "Failed to Load Config", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onTileRemoved() {
        super.onTileRemoved();

        // Do something when the user removes the Tile
    }

    @Override
    public void onTileAdded() {
        super.onTileAdded();

        // Do something when the user add the Tile
    }

    @Override
    public void onStartListening() {
        super.onStartListening();

        // Called when the Tile becomes visible
    }

    @Override
    public void onStopListening() {
        super.onStopListening();

        // Called when the tile is no longer visible
    }

    private JSONObject readFromConfiguration() throws JSONException {
        String ret = "";
        try {
            InputStream inputStream = openFileInput("quickTile.conf");
            if (inputStream != null) {
                InputStreamReader inputStreamReader = new InputStreamReader(inputStream);
                BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
                ret = bufferedReader.readLine();
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return new JSONObject(ret);
    }

    private static int startTimer(String ipAddress, String json_data) {
        OkHttpClient client = new OkHttpClient();
        RequestBody body = RequestBody.create(JSON, json_data);
        Request request = new Request.Builder()
                .url("http://" + ipAddress + ":3030/execute")
                .post(body)
                .build();
        try (Response response = client.newCall(request).execute()) {
            return response.code();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return 500;
    }

    private static int stopTimer(String ipAddress) {
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
                .url("http://" + ipAddress + ":3030/cancel")
                .get()
                .build();
        try (Response response = client.newCall(request).execute()) {
            return response.code();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return 500;
    }
}
