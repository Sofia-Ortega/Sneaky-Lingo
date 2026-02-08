interface Props {
  errorMsg: string;
}

export default function ErrorSnackbar({ errorMsg }: Props) {
  return (
    <div className="bg-amber-950 text-center w-120 py-2 px-4 ">
      <span className="font-bold">[error]</span> {errorMsg}
    </div>
  );
}
