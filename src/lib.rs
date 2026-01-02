use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[derive(Debug, PartialEq)]
enum Direction {
    Up,
    Right,
    Down,
    Left,
}
struct SnakeCell(usize);

struct Snake {
    body: Vec<SnakeCell>,
    direction: Direction,
}

impl Snake {
    pub fn new(spawn_index: usize) -> Self {
        Snake {
            body: vec![SnakeCell(spawn_index)],
            direction: Direction::Up,
        }
    }
}

#[wasm_bindgen]
pub struct World {
    width: usize,
    size: usize,
    snake: Snake,
}

#[wasm_bindgen]
impl World {
    pub fn new(width: usize, snake_spawn_idx: usize) -> Self {
        World {
            width,
            size: width * width,
            snake: Snake::new(snake_spawn_idx),
        }
    }
    pub fn width(&self) -> usize {
        self.width
    }

    pub fn snake_head_idx(&self) -> usize {
        self.snake.body[0].0
    }

    pub fn update(&mut self) {
        let snake_idx = self.snake_head_idx();
        let (row, col) = self.index_to_cell(snake_idx);
        let (row, col) = match self.snake.direction {
            Direction::Right => (row, (col + 1) % self.width),
            Direction::Left => (row, (col - 1) % self.width),
            Direction::Up => ((row - 1) % self.width, col),
            Direction::Down => ((row + 1) % self.width, col),
        };

        let next_idx = self.cell_to_index(row, col);
        self.set_snake_head(next_idx);
    }

    fn set_snake_head(&mut self, idx: usize) {
        self.snake.body[0].0 = idx;
    }

    fn index_to_cell(&self, idx: usize) -> (usize, usize) {
        (idx / self.width, idx % self.width)
    }

    fn cell_to_index(&self, row: usize, col: usize) -> usize {
        (row * self.width) + col
    }
}

#[cfg(test)]
mod tests {
    use crate::World;

    #[test]
    fn it_works() {
        let a = env!("CARGO_MANIFEST_PATH");
        println!("{}", a);
    }
}
