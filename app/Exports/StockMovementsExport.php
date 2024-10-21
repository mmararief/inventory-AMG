<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StockMovementsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $stockMovements;

    public function __construct($stockMovements)
    {
        $this->stockMovements = $stockMovements;
    }

    public function collection()
    {
        return $this->stockMovements;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Type',
            'Product',
            'Quantity',
            'From Location',
            'To Location',
            'Date',
        ];
    }

    public function map($movement): array
    {
        return [
            $movement->id,
            $movement->type,
            $movement->product->name,
            $movement->quantity,
            $movement->fromLocation ? $movement->fromLocation->name : 'N/A',
            $movement->toLocation ? $movement->toLocation->name : 'N/A',
            $movement->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
