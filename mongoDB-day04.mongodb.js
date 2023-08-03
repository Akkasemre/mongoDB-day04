//TODO *************** DAY-04*******************

use("okul")
db.exams.insertMany(
[{"student":"dave", "midterm":80,  "final":100},
{"student":"dave",  "midterm":85,  "final":52},
{"student":"fred",  "midterm":60,  "final":100},
{"student":"wilma", "midterm":55,  "final":50},
{"student":"barnie","midterm":60,  "final":75},
{"student":"wilma", "midterm":94,  "final":99},
{"student":"betty", "midterm":95,  "final":91}]);


use("okul")
db.accounting.insertMany(
[{"name":"dave", "expense":[-80, -40, -50, -120], "earn":[100, 150]},
{"name":"dave",  "expense":[-60, -30, -20],       "earn":[200, 50, 130]},
{"name":"fred",  "expense":[-80, -40, -50],       "earn":[300, 450]},
{"name":"wilma", "expense":[-80, -120],           "earn":[500, 50, 70, 10]},
{"name":"barnie","expense":[-140, -50, -120],     "earn":[400]},
{"name":"wilma", "expense":[-120],                "earn":[22, 375, 65]},
{"name":"betty", "expense":[-180, -40, -70, -12], "earn":[500, 650, 400]}]);

// görüntülerken geçici field'lar eklemek istersek 

//*1-> exam icindeki midterm ve final degerlerinin toplamını result isminde bir field olarak goruntuleyelim.
use("okul");
db.aggregate({$addFields:{result:{$sum:["$midterm","$final"]}}})

use("okul");
var pipeline =[
    {$addFields:{result:{$sum:["$midterm","$final"]}}}
];
db.exams.aggregate(pipeline);

//*2-> a-)acounting icindeki her bir doc icin toplam "expense", toplam "earn" degerlerini list

use("okul");
var pipeline=[
    {$addFields:{total_expense:{$sum:["$expense"]}}},
    {$addFields:{total_earn:{$sum:["$earn"]}}}

    /*
    !{$addFields:{total_expense:{$sum:["$expense"]}},
    !{total_earn:{$sum:["$earn"]}}}

    */
];
db.accounting.aggregate(pipeline);

// * b-) accounting icindeki her doc icin toplam expense, 
//*toplam earn ve nete kazanc ise net_balance olarak gösterelim
use("okul");
var pipeline=[
    //?yeni olusturdugumuz fieldslar ile işlem yapmak için tekrardan field açarak işlem yapmamız gerek
    {$addFields: {total_expense:{$sum:"$expense"},
    total_earn:{$sum:"$earn"}}},
    {$addFields: {net_balance:{$sum:["$total_expense","$total_earn"]}}}
];
db.accounting.aggregate(pipeline);

// * c-) yukarıdaki sorguyu net balance a göre azalan sıralayınız.
use("okul");
var pipeline=[
    {$addFields: {total_expense:{$sum:"$expense"},
    total_earn:{$sum:"$earn"}}},
    {$addFields: {net_balance:{$sum:["$total_expense","$total_earn"]}}},
    {$sort:{net_balance:-1}}
];
db.accounting.aggregate(pipeline);

//*d-) yukarıdaki sorguda bazı fieldları görmek istemessek 
//* sadece total_earn,total_expense,net_balance ve name gözüksün.

use("okul");
var pipeline=[
    {$addFields: {total_expense:{$sum:"$expense"},
    total_earn:{$sum:"$earn"}}},
    {$addFields: {net_balance:{$sum:["$total_expense","$total_earn"]}}},
    {$sort:{net_balance:-1}},
    {$project:{"_id":0,"earn":0,"expense":0}}//! görülmesini istemediğimiz daha az durum oldugundan görmek istemediklerimizi yazdık.
];
db.accounting.aggregate(pipeline);

////===========================================
//todo             bulkWrite([])
////===========================================
//? NOT : hem silme hem ekleme hem update komutları verildiğinde tek bir komutla tüm işlemlerin yapılması.
use("okul")
db.stories.insertMany(
[{"author":"dave", "score":75, "views": 200},
{"author":"chris", "score":90, "views": 100},
{"author":"dave", "score":35, "views": 3000},
{"author":"mary", "score":80, "views": 350},
{"author":"dave", "score":54, "views": 333},
{"author":"mary", "score":97, "views": 2000}]);

//* Task : Aşagidaki birden fazla komudu tek methodla nasil yapabiliriz
//    * Insert {"author":"mark","score":55, "views":555} ,
//    * yazarı Dave olan ilk dökümanın score bilgisini 55 olarak güncelleyin ,
//    * Yazarı :"chris" olan ilk dökümanı {"author":"chris tien","score":55} ile değiştirin ,
//    * Yazarı "mary" olan ilk dökümanı silin .

use("okul")
db.stories.bulkWrite([
    {insertOne:{"document":{"author":"mark","score":55, "views":555}}},//bir doc ekleme 
    {updateOne:{"filter":{"author":"dave"},update:{$set:{score:55}}}},// doc update
    {replaceOne:{"filter":{"author":"chris"},replacement:{"author":"chris tien","score":55}}},// doc replace
    {deleteOne:{"filter":{"author":"mary"}}} // doc delete 
]);

////=========================================================
//todo                  UNIONWITH ( Full Join )
////=========================================================
//
// 2 farklı collectiondan datayı nasıl çekebiliriz ?
// SQL de bunu joinler ile yapıyorduk
//=========================================================
//! Not: normalde mongo db de join islemi yoktur

use("MEDYA")
db.romanlar.insertMany(
[{"yazar": "Mehmet Bak",  "fiyat" : 60, "yayinEvi" : "Yildiz",   "adet": 1000 },//60000
{"yazar" : "Ali Gel",     "fiyat" : 75, "yayinEvi" : "MaviAy",   "adet": 1200 },
{"yazar" : "Su Ak",       "fiyat" : 90, "yayinEvi" : "Caliskan", "adet": 2200},
{"yazar" : "Meryem Can",  "fiyat" : 35, "yayinEvi" : "MorEv",    "adet": 560},
{"yazar" : "Pelin Su",    "fiyat" : 80, "yayinEvi" : "Hedef",    "adet": 890 },
{"yazar" : "Suat Ok",     "fiyat" : 54, "yayinEvi" : "Sinir",    "adet": 245}]);
use("MEDYA")
db.denemeler.insertMany(
[{"yazar": "Mehmet Bak",  "fiyat" : 34, "yayinEvi" : "Yildiz", "adet": 400 },//13600
{"yazar" : "Deniz Kos",   "fiyat" : 44, "yayinEvi" : "Yildiz", "adet": 350 },//15400
{"yazar" : "Su Ak",       "fiyat" : 50, "yayinEvi" : "MorEv", "adet": 200},
{"yazar" : "İsmet Kaç",   "fiyat" : 25, "yayinEvi" : "Hedef","adet": 800},
{"yazar" : "Ali Gel",     "fiyat" : 40, "yayinEvi" : "Hedef", "adet": 1200 },
{"yazar" : "Meryem Can",  "fiyat" : 22, "yayinEvi" : "MaviAy","adet": 300}]);

//* 1->her iki collectiondaki tum doc 
//*"adet" field a göre ters sıralayarak goruntuleyin.
//* id si gözğkmeyecek şekilde sıralayınız
use("MEDYA");
var pipeline=[
    {$unionWith:{coll:"denemeler"}}, //! coll(sabit) ==> hangi collectionları birleştireceğimizi yazıyoruz. 
    //?(romanlar için pipeline yazdıgımız icin denemeleri ekledik.)
    {$sort:{"adet":-1}},
    {$project:{"_id":0}}
];
db.romanlar.aggregate(pipeline)

//*2 -> Her bir yayınevinin toplam kitap sayılarını ( 2 collection için) hesaplayan
//* ve toplam kitap sayısına göre artan sıralayan query yazınız.
use("MEDYA");
var pipeline=[
    //birleştirme
    {$unionWith:{coll:"denemeler"}},
    //gruplama
    {$group:{"_id":"$yayinEvi",toplam_kitap:{$sum:"$adet"}}},
    //sıralama
    {$sort:{"toplam_kitap":1}}
];
db.romanlar.aggregate(pipeline)

// * 3 ) Her bir yayınevinin kitap (deneme veya roman) satıslarından elde edeceği
// * toplam geliri hesaplayan ve azalan sırada gösteren query yazınız

use("MEDYA");
var pipeline =[
//coll birleştirme 
{$unionWith:{coll:"denemeler"}},
//gruplama sum(adet*fiyat)
{$group:{"_id":"$yayinEvi",toplam_gelir:{$sum:{$multiply:["$adet","$fiyat"]}}}},
//sort
{$sort:{toplam_gelir:-1}}
];
db.romanlar.aggregate(pipeline);

//==================================================================================
//                       $LOOKUP (LEFT,( RIGHT, INNER) JOIN)
//    /1. collectionın hepsi, 2. collectiondan ortak olanlar görüntülenir.
//    {
//      $lookup:
//      {
//        from: <Join uygulanacak İlişki kurulacak coll.>,
//        localField: <giris dokumanindaki ilgili yani ilişki kuracak alanı>,
//        foreignField: <Join yapilacak collectiondaki ilişki kurulacak alanı>,
//        as: <İlişkilendirme sonucu eşleşen verilerin atanacağı yeni dizi alanı>
//      },
//      { $unwind:<field path> }//önceki stagedeki fieldı sonraki stage'e aktarır.
//    }
//==================================================================================

use("MEDYA")
db.romanlar.insertMany(
[{"yazar": "Mehmet Bak",  "fiyat" : 60, "yayinEvi" : "Yildiz",   "adet": 1000 },//60000
{"yazar" : "Ali Gel",     "fiyat" : 75, "yayinEvi" : "MaviAy",   "adet": 1200 },
{"yazar" : "Su Ak",       "fiyat" : 90, "yayinEvi" : "Caliskan", "adet": 2200},
{"yazar" : "Meryem Can",  "fiyat" : 35, "yayinEvi" : "MorEv",    "adet": 560},
{"yazar" : "Pelin Su",    "fiyat" : 80, "yayinEvi" : "Hedef",    "adet": 890 },
{"yazar" : "Suat Ok",     "fiyat" : 54, "yayinEvi" : "Sinir",    "adet": 245}]); 

use("MEDYA")
db.siirler.insertMany(
[{"muellif": "Mehmet Bak",   "fiyat" : 34, "yayinEvi" : "Yildiz", "adet": 400 },
{"muellif" : "Ali Gel",      "fiyat" : 40, "yayinEvi" : "Hedef",  "adet": 1200 },
{"muellif" : "Su Ak",        "fiyat" : 50, "yayinEvi" : "MorEv",  "adet": 200},
{"muellif" : "Meryem Can",   "fiyat" : 22, "yayinEvi" : "MaviAy", "adet": 300},
{"muellif" : "Deniz Kos",    "fiyat" : 44, "yayinEvi" : "Yildiz", "adet": 350 },
{"muellif" : "İsmet Kaç",    "fiyat" : 25, "yayinEvi" : "Hedef",  "adet": 800}]);

//* QUERY1: romanlar collectionından tüm yazarlar ve
//*şiirler ile ortak olan yazarları listeyiniz.

use("MEDYA");
var pipeline=[
{$lookup: {
  from: "siirler",//? icinden sadece ortak elemanların geleceği collection 
  localField: "yazar", //? ana collection daki field
  foreignField: "muellif", //? birleşecek collection daki field
  as: "ortak_muellif" //? siirler collection daki ortak datayı getirip ortak_muellif icine alır
}}
];
db.romanlar.aggregate(pipeline); //!ana collection romanlar oldugundan romanları aggragate ediyoruz

//* QUERY2: siirler collectionından tüm yazarlar ve
//* romanlar ile ortak olan yazarları listeyiniz.
use("MEDYA");
var pipeline=[
    {$lookup: {
      from: "romanlar",
      localField: "yazar",
      foreignField: "romanlar",
      as: "ortak_romanlar"
    }}
];
db.siirler.aggregate(pipeline);

// QUERY3: Her 2 collectionda (romanlar, şiirler) ortak olan yazarların toplam
// kitap sayılarını ve  fiyat toplamını hesaplayan query yazınız


//!bu inner join e benzetilebilir.

use("MEDYA");
var pipeline=[
{$lookup: {
  from: "siirler",
  localField: "yazar",
  foreignField: "muellif",
  as: "ortak_muellif"//? siirler data collection daki ortak daya tı ortak muellif isminde diziye koyar
}},
{$unwind:{path:"$ortak_muellif"}}, //? ortak_muellif icindeki doc yeni bir colleciton gibi sonraki satırda kullanabilir.
{$addFields:{toplam_kitap:{$sum:["$adet","$ortak_muellif.adet"]},
            toplam_fiyat:{$sum:["$fiyat","$ortak_muellif.fiyat"]}}},
{$project:{"_id":0,"toplam_kitap":1,"toplam_fiyat":1,"yazar":1}}            
];
db.romanlar.aggregate(pipeline)//!ortak oldugu icin ne yazdıgımız onemli degil