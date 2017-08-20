package ma.expresscourse;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
/*
import android.content.res.Configuration;
import android.widget.Toast;*/
/**
 *
 * @author RABBAH
 */
public class ExpresseCourse extends Activity {

    // Splash screen timer
    private static int SPLASH_TIME_OUT = 3000;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        new Handler().postDelayed(new Runnable() {

            /*
             * Showing splash screen with a timer. This will be useful when you
             * want to show case your app logo / company
             */
            @Override
            public void run() {
                /*int screenSize = getResources().getConfiguration().screenLayout &
                        Configuration.SCREENLAYOUT_SIZE_MASK;

                String toastMsg;
                switch(screenSize) {
                    case Configuration.SCREENLAYOUT_SIZE_LARGE:
                        toastMsg = "Large screen";
                        break;
                    case Configuration.SCREENLAYOUT_SIZE_NORMAL:
                        toastMsg = "Normal screen";
                        break;
                    case Configuration.SCREENLAYOUT_SIZE_SMALL:
                        toastMsg = "Small screen";
                        break;
                    default:
                        toastMsg = "Screen size is neither large, normal or small";
                }
                Toast.makeText(getApplicationContext(), toastMsg, Toast.LENGTH_LONG).show();*/
                // This method will be executed once the timer is over
                // Start your app main activity
                Intent i = new Intent(ExpresseCourse.this, MainActivity.class);
                startActivity(i);

                // close this activity
                finish();
            }
        }, SPLASH_TIME_OUT);
    }

}
