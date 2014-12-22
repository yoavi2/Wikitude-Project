package com.example.wikitudeproject;

import com.wikitude.architect.ArchitectView.ArchitectUrlListener;
import com.wikitude.architect.ArchitectView.SensorAccuracyChangeListener;

import android.hardware.SensorManager;
import android.location.LocationListener;
import android.widget.Toast;

public class MainActivity extends AbstractArchitectCamActivity {

	/**
	 * last time the calibration toast was shown, this avoids too many toast shown when compass needs calibration
	 */
	private long lastCalibrationToastShownTimeMillis = System.currentTimeMillis();
	
	@Override
	protected boolean hasGeo() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	protected boolean hasIR() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public String getActivityTitle() {
		// TODO Auto-generated method stub
		return "Tar Team";
	}

	@Override
	public String getARchitectWorldPath() {
		// TODO Auto-generated method stub
		return "samples/3_Point$Of$Interest_4_Selecting$Pois/index.html";
	}

	@Override
	public int getContentViewId() {
		return R.layout.activity_main;
	}

	@Override
	public int getArchitectViewId() {
		return R.id.architectView;
	}

	@Override
	public ILocationProvider getLocationProvider(
			LocationListener locationListener) {
		return new LocationProvider(this, locationListener);
	}

	@Override
	public float getInitialCullingDistanceMeters() {
		// TODO Auto-generated method stub
		return 1;
	}
	
	@Override
	public String getWikitudeSDKLicenseKey() {
		return WikitudeSDKConstants.WIKITUDE_SDK_KEY;
	}
	
	@Override
	public SensorAccuracyChangeListener getSensorAccuracyListener() {
		return new SensorAccuracyChangeListener() {
			@Override
			public void onCompassAccuracyChanged( int accuracy ) {
				/* UNRELIABLE = 0, LOW = 1, MEDIUM = 2, HIGH = 3 */
				if ( accuracy < SensorManager.SENSOR_STATUS_ACCURACY_MEDIUM && MainActivity.this != null && !MainActivity.this.isFinishing() && System.currentTimeMillis() - MainActivity.this.lastCalibrationToastShownTimeMillis > 5 * 1000) {
					Toast.makeText( MainActivity.this, R.string.compass_accuracy_low, Toast.LENGTH_LONG ).show();
					MainActivity.this.lastCalibrationToastShownTimeMillis = System.currentTimeMillis();
				}
			}
		};
	}

	@Override
	public ArchitectUrlListener getUrlListener() {
		return new ArchitectUrlListener() {

			@Override
			public boolean urlWasInvoked(String uriString) {
				// by default: no action applied when url was invoked
				return false;
			}
		};
	}

}
