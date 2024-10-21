<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stock Movements</title>
    <style>
        body { 
            font-family: 'Helvetica', 'Arial', sans-serif; 
            line-height: 1.6;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 20px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px;
        }
        th, td { 
            border: 1px solid #bdc3c7; 
            padding: 12px; 
            text-align: left; 
        }
        th { 
            background-color: #34495e; 
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .movement-in {
            color: #27ae60;
        }
        .movement-out {
            color: #e74c3c;
        }
    </style>
</head>
<body>
    <h1>Stock Movements Report</h1>
    <h3>From: {{ $startDate }} To: {{ $endDate }}</h3>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Product</th>
                <th>From</th>
                <th>To</th>
                <th>Quantity</th>
                <th>Type</th>
            </tr>
        </thead>
        <tbody>
            @foreach($stockMovements as $movement)
                <tr>
                    <td>{{ $movement->created_at->format('Y-m-d H:i:s') }}</td>
                    <td>{{ $movement->product->name }}</td>
                    <td>{{  $movement->fromLocation->name ?? '-' }}</td>
                    <td>{{  $movement->toLocation->name ?? '-' }}</td>
                    <td>{{ $movement->quantity }}</td>
                    <td class="movement-{{ $movement->type }}">{{ strtoupper($movement->type) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
