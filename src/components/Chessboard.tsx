import { useState, useEffect } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';
import { useToast } from './ui/use-toast';

interface IProps {
  pgn: string;
}

const ChessboardComponent = ({ pgn }: IProps) => {
  const { toast } = useToast();
  const [fen, setFen] = useState('start');

  useEffect(() => {
    const game = new Chess();
    const trimmed = (pgn ?? '').trim();
    if (!trimmed) {
      setFen('start');
      return;
    }
    try {
      game.loadPgn(trimmed);
      setFen(game.fen());
    } catch {
      setFen('start');
      toast({
        variant: 'destructive',
        title: 'Kiritilayotgan PGNda xatolik bor',
      });
    }
  }, [pgn, toast]);

  return <Chessboard position={fen} />;
};

export default ChessboardComponent;
