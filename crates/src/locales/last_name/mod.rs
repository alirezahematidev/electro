mod en;
mod fa;

pub trait LastName {
    const EN: &'static [&'static str] = en::EN_LAST_NAMES;
    const FA: &'static [&'static str] = fa::FA_LAST_NAMES;
}

pub struct FakeLastName;

impl LastName for FakeLastName {}
