# Twitter Backend Klonu

Bu projem, temel Twitter işlemlerini gerçekleştirebilen bir Node.js ve Express.js tabanlı backend uygulamasını içeriyor. Kullanıcılar tweetler oluşturabilir, görüntüleyebilir, güncelleyebilir ve silebilir. Ayrıca kimlik doğrulama ve yetkilendirme işlemleri sağlanmıştır.

## Başlangıç

Projeyi yerel makinanıza klonlayarak veya ZIP dosyası olarak indirerek başlayabilirsiniz. Ardından aşağıdaki adımları takip edin:

1. Projeyi klonlayın veya ZIP dosyasını indirin.

2. Proje klasörüne gidin ve bağımlılıkları yüklemek için aşağıdaki komutu çalıştırın: npm install

3. MongoDB veritabanınızı ayarlayın ve bağlantı bilgilerini projenize entegre edin.

4. `.env` dosyasını oluşturun ve gerekli ortam değişkenlerini tanımlayın (örneğin, JWT_SECRET, MongoDB bağlantı URL'si).

5. Projeyi başlatmak için aşağıdaki komutu kullanın: npm start

6. API endpoint'lerini test etmek için Postman veya benzer bir araç kullanabilirsiniz.

## Kullanılan Teknolojiler

- Node.js
- Express.js
- MongoDB (Mongoose ile)
- Bcrypt (şifreleme)
- Jsonwebtoken (JWT kimlik doğrulama)
- Express-session (oturum yönetimi)
- Connect-mongo (oturum verilerini MongoDB'ye saklama)
- Winston (loglama)

## Özellikler

- Kullanıcı kaydı (signup) ve girişi (login).
- Tweet oluşturma, görüntüleme, güncelleme ve silme işlemleri.
- JWT tabanlı kimlik doğrulama ve yetkilendirme.
- Hata yakalama ve loglama işlemleri.

## Katkıda Bulunma

Eğer projeye katkıda bulunmak veya hataları düzeltmek isterseniz, lütfen aşağıdaki adımları izleyin:

1. Bu repo'yu fork edin.

2. Yeni özellikler ekleyin veya hata düzeltmeleri yapın.

3. Değişikliklerinizi bir pull isteği (pull request) olarak gönderin.

4. İnceleme süreci başlayacaktır.



