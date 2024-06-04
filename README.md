# Aplikacja - rezerwacja biletów w kinie

## Skład grupy

- Marcin Walendzik
- Szymon Miękina
- Ignacy Siklucki

## Technologie

Baza danych: Postgres

Backend: Node.js

ORM: Sequelize

## Główne operacje

- rezerwacja biletu, wybór fotela, "zapłata"
- rezygnacja z rezerwacji
- wyświetlenie rezerwacji
- wyświetlenie repertuaru

## Repozytorium

[Link](https://github.com/szym-mie/cinema-tickets-project)



## Spis treści

* [Skład grupy](#skład-grupy)
* [Technologie](#technologie)
* [Główne operacje](#główne-operacje)
* [Repozytorium](#repozytorium)
* [Spis treści](#spis-treści)
* [Tabele](#tabele)
    * [Movie](#movie)
    * [Show](#show)
    * [Room](#room)
    * [Ticket](#ticket)
    * [Payment](#payment)
    * [User](#user)
    * [Log](#log)
* [Relacje](#relacje)


## Tabele

### Movie
Filmy

|kolumna|typ|opis|
|:-|:-:|:-|
|id|bigint|klucz główny|
|title|string|tytuł filmu|
|description|text|opis filmu|
|year|int|rok premiery filmu|
|runtime|int|długość filmu w minutach|

### Show
Seanse

|kolumna|typ|opis|
|:-|:-:|:-|
|id|bigint|klucz główny|
|movieId|bigint|ID filmu|
|roomId|bigint|ID sali kinowej|
|price|decimal|cena jednego biletu|
|date|dateonly|data odbycia się seansu|
|time|time|godzina rozpoczęcia seansu|

### Room
Sale kinowe

|kolumna|typ|opis|
|:-|:-:|:-|
|id|bigint|klucz główny|
|number|string|numer sali kinowej|
|seats|smallint|numer foteli w sali|

### Ticket
Bilety

|kolumna|typ|opis|
|:-|:-:|:-|
|id|bigint|klucz główny|
|token|string|unikatowy token biletu|
|userId|bigint|ID użytkownika|
|showId|bigint|ID zarezerwowanego seansu|
|paymentId|bigint|ID płatności|
|seatNumber|smallint|numer zarezerwowanego fotela|

### Payment
Płatności

|kolumna|typ|opis|
|:-|:-:|:-|
|id|bigint|klucz główny|
|userId|bigint|ID użytkownika|
|token|string|token płatności|
|issueTime|date|data i czas płatności|
|isPaid|bool|status opłacenia płatności|

### User
Użytkownicy (klienci)

|kolumna|typ|opis|
|:-|:-:|:-|
|id|bigint|klucz główny|
|login|string|nazwa użytkownika|
|password|string|zhaszowane hasło użytkownika|
|email|string|email użytkownika|
|currentSession|string|token aktywnej sesji|

### Log
Logi (dziennik)

|kolumna|typ|opis|
|:-|:-:|:-|
|id|bigint|klucz główny|
|type|string|typ logu: INFO lub ERROR|
|message|text|zawartość wiadomości logu|
|eventTime|date|data i czas zdarzenia|
|about|string|tytuł logu (nazwa dotyczącej tabeli)|


## Relacje

|tabela 1|relacja|tabela 2|klucz|
|:-|:-:|:-|:-|
|Movie|1:n|Show|movieId|
|Room|1:n|Show|roomId|
|Payment|1:n|Ticket|paymentId|
|Show|1:n|Ticket|showId|
|User|1:n|Ticket|userId|
