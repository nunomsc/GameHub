PS C:\Users\nuno.cordeiro\Herd\gamehub> php artisan tinker

use App\Models\Install;
Install::where('status', 'downloading')->update(['status' => 'pending']);



php artisan queue:work --timeout=0