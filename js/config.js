document.config = {
    "proxydns": {
        "gtm": 'GTM-KKJ2G9Z',
        "slogan": '<b>Feel the freedom</b></br>No Registration Required',
        "calltoaction": 'Try it for $0.99',
        "plans": {
            "try": {
                amount: 0.99,
                paypal_item_id: 'P2D',
                days: 2,
                price: '$0.99',
                price_detail: 'per month',
                header: 'Try it for a couple of days',
                description: `2 day trial`,
                paypal: `<form action="https://www.paypal.com/cgi-bin/webscr" method="post" name="0.99" target="_top">
                <input type="hidden" name="cmd" value="_s-xclick">
                <input type="hidden" name="hosted_button_id" value="EJCPBHYL7RNGU">
                <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
                <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
                </form>
                `
            },
            "plan1": {
                amount: 3.99,
                title: '<h4>1</h4><span>Month</span>',
                paypal_item_id: 'P1M',
                description: `<ul>
                <li>
                <b>Geo-Unblocking:</b> Netflix, Hulu, ABC, CBS, Disney, HBO, ESPN, TNT, Showtime, BBC, and more.
                </li>
                
                <li>
                <small>
                <b>Browser:</b> Chrome Extension
                </br><b>Devices:</b> AppleTV, Android, XBOX, iPad, iPhone, PS4, Nexus, etc.
                </small>
                </li>
                
        </ul>
                `,
                price: '$3.99',
                period: 'per month',
                paypal_item_id: 'WYEAR',
                saving: '',
                days: 30,
                paypal: `<form action="https://www.paypal.com/cgi-bin/webscr" name="3.99" method="post" target="_top">
                <input type="hidden" name="cmd" value="_s-xclick">
                <input type="hidden" name="hosted_button_id" value="H48PSX2BZGE52">
                <input type="image" name="main2" src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
                <img alt="" name="img" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
                </form>                
                `
            },
            "plan2": {
                amount: 35.99,
                title: '<h4>1</h4><span>Year</span>',
                description: `<ul>
                                    <li>
                                    <b>Geo-Unblocking:</b> Netflix, Hulu, ABC, CBS, Disney, HBO, ESPN, TNT, Showtime, BBC, and more.
                                    </li>
                                    
                                    <li>
                                    <small>
                                    <b>Browser:</b> Chrome Extension
                                    </br><b>Devices:</b> AppleTV, Android, XBOX, iPad, iPhone, PS4, Nexus, etc.
                                    </small>
                                    </li>
                                    
                            </ul>
                                    `,
                price: '$35.99',
                period: 'per year',
                saving: '(Save $11.89)',
                days: 30,
                paypal: `<form action="https://www.paypal.com/cgi-bin/webscr" name="35.99" method="post" target="_top">
                <input type="hidden" name="cmd" value="_s-xclick">
                <input type="hidden" name="hosted_button_id" value="G357XWMX4CENA">
                <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
                <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
                </form>                
                `
            },
        },
        'setup': [
            {
                'id': 'chrome',
                'onclick': 'chrome.webstore.install()',
                'title': "Google Chrome",
                'description': "Just one click!",
                'image': '<img src="/images/chrome.png?v2" alt="Google Chrome" />'
            },
            {
                'id': 'appletv2',
                'youtube': 'https://www.youtube.com/embed/16KdQpir4Kg',
                'title': "AppleTV",
                'description': "Movies without borders!",
                'image': '<img src="/images/appletv.png" alt="AppleTV" />'            
            },
            {
                'id': 'appletv',
                'youtube': 'https://www.youtube.com/embed/c2dW3rPwV_Y',
                'title': "AppleTV (old version)",
                'description': "Still rocking it?!",
                'image': '<img src="/images/appletv.png" alt="AppleTV" />'            
            },  
            {
                'id': 'macosx',
                'youtube': 'https://www.youtube.com/embed/IV18ufPrXqw',
                'title': "OSX",
                'description': "OS Unblocked!",
                'image': '<img src="/images/osx.png" alt="MacOSX" />'            
            },        
            {
                'id': 'ios',
                'youtube': 'https://www.youtube.com/embed/q8OcNvgnt00',
                'title': "iOS",
                'description': "Apps unblocked!",
                'image': '<img src="/images/ios.png" alt="iPhone" />'            
            },      
            {
                'id': 'xboxone',
                'youtube': 'https://www.youtube.com/embed/IkOnYywix0o',
                'title': "XBOX ONE",
                'description': "Gaming unlocked!",
                'image': '<img src="/images/xboxone.png" alt="Xbox One" />'            
            },
            {
                'id': 'android',
                'title': "Android",
                'description': "Stream anything anywhere with your Android phone",
                'image': '<img src="/images/android.png" alt="Android" />'            
            },
            {
                'id': 'windows7',
                'title': "Windows 7",
                'description': "Limitless streaming",
                'image': '<img src="/images/windowsold.png" alt="Windows7" />'            
            },
            {
                'id': 'windows8',
                'title': "Windows 8",
                'description': "No more geo-restrictions",
                'image': '<img src="/images/windows.png" alt="Windows8" />'            
            }]
    },
    "wipzard": {
        "gtm": 'GTM-NG5H8HH',        
        "slogan": '<b>Feel the freedom</b></br>No Registration Required',
        "calltoaction": 'Try it for $0.99',
        "plans": {
            "try": {
                amount: 0.99,
                paypal_item_id: 'ODP1',
                days: 2,
                price: '$0.99',
                price_detail: 'per month',
                header: 'Try it for a couple of days',
                description: `2 day trial`,
                paypal: `<form action="https://www.paypal.com/cgi-bin/webscr" name="0.99" method="post" target="_top">
                <input type="hidden" name="cmd" value="_s-xclick">
                <input type="hidden" name="hosted_button_id" value="S45MTZ53CY9AN">
                <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
                <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
              </form>`
            },
            "plan1": {
                amount: 3.99,
                title: '<h4>1</h4><span>Month</span>',
                paypal_item_id: 'WMONTH',
                description: `<ul>
                <li>
                <b>Geo-Unblocking:</b> Netflix, Hulu, ABC, CBS, Disney, HBO, ESPN, TNT, Showtime, BBC, and more.
                </li>
                
                <li>
                <small>
                <b>Browser:</b> Chrome Extension
                </br><b>Devices:</b> AppleTV, XBOX, iPad, iPhone, PS4, Nexus (using DNS).
                </small>
                </li>
                
        </ul>
                `,
                price: '$3.99',
                period: 'per month',
                paypal_item_id: 'WYEAR',
                saving: '',
                days: 30,
                paypal: `<form action="https://www.paypal.com/cgi-bin/webscr" name="3.99" method="post" target="_top">
                <input type="hidden" name="cmd" value="_s-xclick">
                <input type="hidden" name="hosted_button_id" value="93M7A5PCYM7ZU">
                <input type="image" name="input" src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
                <img alt="" border="0" name="img" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
                </form>
                `
            },
            "plan2": {
                amount: 35.99,
                title: '<h4>1</h4><span>Year</span>',
                description: `<ul>
                                    <li>
                                    <b>Geo-Unblocking:</b> Netflix, Hulu, ABC, CBS, Disney, HBO, ESPN, TNT, Showtime, BBC, and more.
                                    </li>
                                    
                                    <li>
                                    <small>
                                    <b>Browser:</b> Chrome Extension
                                    </br><b>Devices:</b> AppleTV, XBOX, iPad, iPhone, PS4, Nexus (using DNS).
                                    </small>
                                    </li>
                                    
                            </ul>
                                    `,
                price: '$35.99',
                period: 'per year',
                saving: '(Save $11.89)',
                days: 30,
                paypal: `<form action="https://www.paypal.com/cgi-bin/webscr" name="35.99" method="post" target="_top">
                <input type="hidden" name="cmd" value="_s-xclick">
                <input type="hidden" name="hosted_button_id" value="6MV9T5YELFHE4">
                <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
                <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
                </form>
                `
            },
        },
        'setup': [
        {
            'id': 'appletv2',
            'youtube': 'https://www.youtube.com/embed/16KdQpir4Kg',
            'title': "AppleTV",
            'description': "Movies without borders!",
            'image': '<img src="/images/appletv.png" alt="AppleTV" />'            
        },
        {
            'id': 'appletv',
            'youtube': 'https://www.youtube.com/embed/c2dW3rPwV_Y',
            'title': "AppleTV (old version)",
            'description': "Still rocking it?!",
            'image': '<img src="/images/appletv.png" alt="AppleTV" />'            
        },  
        {
            'id': 'macosx',
            'youtube': 'https://www.youtube.com/embed/IV18ufPrXqw',
            'title': "OSX",
            'description': "OS Unblocked!",
            'image': '<img src="/images/osx.png" alt="MacOSX" />'            
        },        
        {
            'id': 'ios',
            'youtube': 'https://www.youtube.com/embed/q8OcNvgnt00',
            'title': "iOS",
            'description': "Apps unblocked!",
            'image': '<img src="/images/ios.png" alt="iPhone" />'            
        },      
        {
            'id': 'xboxone',
            'youtube': 'https://www.youtube.com/embed/IkOnYywix0o',
            'title': "XBOX ONE",
            'description': "Gaming unlocked!",
            'image': '<img src="/images/xboxone.png" alt="Xbox One" />'            
        },
        {
            'id': 'android',
            'title': "Android",
            'description': "Stream anything anywhere with your Android phone",
            'image': '<img src="/images/android.png" alt="Android" />'            
        },
        {
            'id': 'windows7',
            'title': "Windows 7",
            'description': "Limitless streaming",
            'image': '<img src="/images/windowsold.png" alt="Windows7" />'            
        },
        {
            'id': 'windows8',
            'title': "Windows 8",
            'description': "No more geo-restrictions",
            'image': '<img src="/images/windows.png" alt="Windows8" />'            
        }]
    }
}