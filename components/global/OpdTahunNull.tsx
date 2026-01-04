interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => (
  <div className="flex flex-wrap justify-center m-3 p-5 border-2 border-gray-600 rounded-lg uppercase">
    <h1 className="font-bold text-gray-600 text-center">{message}</h1>
  </div>
);

export const OpdTahunNull = () => (
  <EmptyState message="Pilih Perangkat Daerah & Tahun di header terlebih dahulu" />
);

export const TahunNull = () => (
  <EmptyState message="Pilih Tahun di header terlebih dahulu" />
);

export const OpdNull = () => (
  <EmptyState message="Pilih Perangkat Daerah di header terlebih dahulu" />
);
