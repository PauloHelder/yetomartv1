
import { Category, Product, Lesson, Sale } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Mastering React 18',
    description: 'Aprenda do zero ao avançado com as novas APIs do React.',
    price: 197.00,
    category: Category.COURSE,
    imageUrl: 'https://picsum.photos/seed/react/600/400',
    contentCount: 24,
    status: 'published',
    modules: [
      {
        id: 'm1',
        title: 'Módulo 1: Introdução',
        lessons: [
          { id: 'l1', title: '01 - Introdução ao curso', duration: '05:20', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
          { id: 'l2', title: '02 - Configurando o ambiente', duration: '12:45', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
        ]
      },
      {
        id: 'm2',
        title: 'Módulo 2: Hooks na Prática',
        lessons: [
          { id: 'l3', title: '03 - Fundamentos de Hooks', duration: '20:10', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', locked: true },
          { id: 'l4', title: '04 - Gerenciamento de Estado', duration: '18:30', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', locked: true },
        ]
      }
    ],
    quiz: {
      id: 'q1',
      title: 'Quiz Final: React 18',
      questions: [
        {
          id: 'q1_1',
          text: 'Qual hook é usado para gerenciar estado em componentes funcionais?',
          options: ['useEffect', 'useState', 'useContext', 'useReducer'],
          correctOptionIndex: 1
        },
        {
          id: 'q1_2',
          text: 'O que o React 18 introduziu para renderização concorrente?',
          options: ['Hooks', 'Suspense', 'Automatic Batching', 'Virtual DOM'],
          correctOptionIndex: 2
        }
      ]
    }
  },
  {
    id: '2',
    title: 'Design para Não-Designers',
    description: 'Um guia prático para criar interfaces incríveis mesmo sem talento nato.',
    price: 47.00,
    category: Category.EBOOK,
    imageUrl: 'https://picsum.photos/seed/design/600/400',
    contentCount: 120,
    status: 'published'
  },
  {
    id: '3',
    title: 'Clube do Empreendedor',
    description: 'Acesso mensal a mentorias exclusivas e networking de alto nível.',
    price: 97.00,
    category: Category.SUBSCRIPTION,
    imageUrl: 'https://picsum.photos/seed/club/600/400',
    contentCount: 1,
    status: 'published'
  },
  {
    id: '4',
    title: 'Node.js Escalável',
    description: 'Construa microsserviços robustos e APIs de alta performance.',
    price: 297.00,
    category: Category.COURSE,
    imageUrl: 'https://picsum.photos/seed/node/600/400',
    contentCount: 18,
    status: 'published',
    modules: [
      {
        id: 'nm1',
        title: 'Módulo 1: Arquitetura',
        lessons: [
          { id: 'nl1', title: '01 - Introdução ao Node.js', duration: '08:15', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
        ]
      }
    ]
  }
];

export const MOCK_LESSONS: Lesson[] = [
  { id: 'l1', title: '01 - Introdução ao curso', duration: '05:20', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  { id: 'l2', title: '02 - Configurando o ambiente', duration: '12:45', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
  { id: 'l3', title: '03 - Fundamentos de Hooks', duration: '20:10', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', locked: true },
  { id: 'l4', title: '04 - Gerenciamento de Estado', duration: '18:30', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', locked: true },
  { id: 'l5', title: '05 - Performance Avançada', duration: '25:00', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', locked: true },
];

export const MOCK_SALES: Sale[] = [
  {
    id: 's1',
    studentName: 'João Silva',
    studentEmail: 'joao.silva@email.com',
    productTitle: 'Mastering React 18',
    productId: '1',
    date: '2024-03-28',
    amount: 197.00,
    status: 'completed'
  },
  {
    id: 's2',
    studentName: 'Maria Oliveira',
    studentEmail: 'maria.o@email.com',
    productTitle: 'Design para Não-Designers',
    productId: '2',
    date: '2024-03-29',
    amount: 47.00,
    status: 'completed'
  },
  {
    id: 's3',
    studentName: 'Pedro Santos',
    studentEmail: 'pedro.santos@email.com',
    productTitle: 'Mastering React 18',
    productId: '1',
    date: '2024-03-30',
    amount: 197.00,
    status: 'completed'
  },
  {
    id: 's4',
    studentName: 'Ana Costa',
    studentEmail: 'ana.costa@email.com',
    productTitle: 'Clube do Empreendedor',
    productId: '3',
    date: '2024-03-31',
    amount: 97.00,
    status: 'pending'
  },
  {
    id: 's5',
    studentName: 'Lucas Rocha',
    studentEmail: 'lucas.rocha@email.com',
    productTitle: 'Node.js Escalável',
    productId: '4',
    date: '2024-04-01',
    amount: 297.00,
    status: 'completed'
  }
];
