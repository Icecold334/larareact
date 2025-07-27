<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <title>Penjualan {{ $kode }}</title>
  <style>
    body {
      font-family: sans-serif;
      font-size: 12px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }

    th,
    td {
      border: 1px solid #000;
      padding: 6px;
    }

    th {
      background-color: #eee;
    }

    .text-right {
      text-align: right;
    }
  </style>
</head>

<body>
  <h2>Detail Penjualan</h2>
  <p><strong>Kode:</strong> {{ $kode }}</p>
  <p><strong>Tanggal:</strong> {{ \Carbon\Carbon::parse($transaksiList[0]->created_at)->format('d M Y') }}</p>

  <table>
    <thead>
      <tr>
        <th>Nama</th>
        <th>Tipe</th>
        <th>Warna</th>
        <th>Supplier</th>
        <th>Harga Jual</th>
        <th>Jumlah</th>
        <th>Subtotal</th>
      </tr>
    </thead>
    <tbody>
      @foreach ($transaksiList as $trx)
      <tr>
        <td>{{ $trx->barang->nama }}</td>
        <td>{{ $trx->barang->tipe }}</td>
        <td>{{ $trx->barang->warna }}</td>
        <td>{{ $trx->supplier->nama ?? '-' }}</td>
        <td class="text-right">Rp {{ number_format($trx->harga_jual, 0, ',', '.') }}</td>
        <td class="text-right">{{ $trx->jumlah }}</td>
        <td class="text-right">Rp {{ number_format($trx->harga_jual * $trx->jumlah, 0, ',', '.') }}</td>
      </tr>
      @endforeach
      <tr>
        <td colspan="6" class="text-right"><strong>Total</strong></td>
        <td class="text-right"><strong>Rp {{ number_format($subtotal, 0, ',', '.') }}</strong></td>
      </tr>
    </tbody>
  </table>
</body>

</html>