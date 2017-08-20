
package ma.expresscourse;

import android.os.Bundle;
import org.apache.cordova.*;

public class MainActivity extends CordovaActivity
{
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        super.init();
        super.setIntegerProperty("loadUrlTimeoutValue", 60000);
        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
    }
}
