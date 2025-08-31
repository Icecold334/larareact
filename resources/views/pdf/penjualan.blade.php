<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <title>Nota Penjualan {{ $kode }}</title>
  <style>
    body {
      font-family: sans-serif;
      font-size: 12px;
      margin: 2px;
      /* rapetin margin halaman */
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th,
    td {
      border: 1px solid #000;
      padding: 2px 4px;
      /* lebih rapat */
    }

    th {
      background-color: #eee;
    }

    .text-right {
      text-align: right;
    }

    .no-border td {
      border: none;
      vertical-align: top;
      padding: 0 3px;
    }

    .company h2 {
      margin: 0;
      font-size: 12px;
      color: #c00;
    }

    .company p {
      margin: 1px 0;
    }

    .note {
      font-size: 9px;
      border: 1px solid #000;
      padding: 3px;
      width: 55%;
    }
  </style>
</head>

<body>
  {{-- HEADER --}}
  <table class="no-border">
    <tr>
      <td style="width: 15%; text-align:center;">
        <div style="width:50px;height:35px;border:1px solid #aaa;line-height:35px;font-size:8px;color:#999;">
          LOGO
        </div>
      </td>
      <td style="width: 55%;" class="company">
        <h2>{{ $alamat['label'] ?? '' }}</h2>
        <p>{{ $alamat['alamat'] ?? '' }}</p>
      </td>
      <td style="width: 30%; text-align:right; font-size:10px;">
        <p>{{ now()->format('d M Y') }}</p>
        <p>Kepada Yth,</p>
        <p>......................</p>
        <p>......................</p>
      </td>
    </tr>
  </table>

  <p style="margin:4px 0;"><strong>NOTA KONTAN NO:</strong> {{ $kode }}</p>

  {{-- TABEL BARANG --}}
  <table>
    <thead>
      <tr>
        <th style="width: 15%;">Qty</th>
        <th style="width: 45%;">Nama Barang</th>
        <th style="width: 20%;">Harga</th>
        <th style="width: 20%;">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      @foreach($transaksiList as $trx)
      <tr>
        <td class="text-right">{{ $trx->jumlah }}</td>
        <td>{{ $trx->barang->nama }} ({{ $trx->barang->tipe }}/{{ $trx->barang->warna }})</td>
        <td class="text-right">Rp {{ number_format($trx->harga_jual, 0, ',', '.') }}</td>
        <td class="text-right">Rp {{ number_format($trx->harga_jual * $trx->jumlah, 0, ',', '.') }}</td>
      </tr>
      @endforeach
      <tr>
        <td colspan="3" class="text-right"><strong>Total</strong></td>
        <td class="text-right"><strong>Rp {{ number_format($subtotal, 0, ',', '.') }}</strong></td>
      </tr>
    </tbody>
  </table>

  {{-- FOOTER --}}
  <div style="display:flex;justify-content:space-between;margin-top:10px;">
    <div class="note">
      Barang yang sudah dibeli tidak dapat ditukar/dikembalikan
    </div>
    <div style="text-align:right;font-size:10px;">
      <p>Hormat kami,</p>
      <br><br><br>
      <p>(......................)</p>
    </div>
  </div>
</body>

</html>